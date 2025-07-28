import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { PaymentEntity } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderLineEntity } from './entities/order-line.entity';
import { ProductsService } from 'src/products/products.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ClientsService } from 'src/clients/clients.service';
import { OrderStatus } from './enums/order-status.enum';
import { OrderLineDto } from './dto/order-lines.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderLineEntity)
    private readonly olRepository: Repository<OrderLineEntity>,
    private readonly productService: ProductsService,
    private readonly clientService: ClientsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
    const orderEntity = await this.createOrderEntity(createOrderDto, currentUser);
    const order = await this.orderRepository.save(orderEntity);
    await this.createOrderLines(order, createOrderDto.orderLines);
    return await this.findOne(order.id);
  }

  private async createOrderEntity(createOrderDto: CreateOrderDto, currentUser: UserEntity): Promise<OrderEntity> {
    const orderEntity = new OrderEntity();
    orderEntity.addedBy = currentUser;

    const client = await this.clientService.findOne(createOrderDto.clientId);
    orderEntity.client = client;

    if (createOrderDto.payments) {
      orderEntity.payments = this.createPaymentEntities(createOrderDto.payments, orderEntity);
    }

    return orderEntity;
  }

  private createPaymentEntities(paymentDtos: CreatePaymentDto[], orderEntity: OrderEntity): PaymentEntity[] {
    return paymentDtos.map((paymentDto) => {
      const payment = new PaymentEntity();
      Object.assign(payment, paymentDto);
      payment.order = orderEntity;
      return payment;
    });
  }

  private async createOrderLines(order: OrderEntity, orderLines: OrderLineDto[]) {
    const olEntities = await Promise.all(orderLines.map(async (line) => {
      const product = await this.productService.findOne(line.productId);
      return {
        order,
        product,
        product_quantity: line.product_quantity,
        product_unit_price: product.price,
      };
    }));

    await this.olRepository.createQueryBuilder()
      .insert()
      .into(OrderLineEntity)
      .values(olEntities)
      .execute();
  }

  async findAll() {
    return this.orderRepository.find();
  }

async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        client: true,
        addedBy: true,
        orderLines: {
          product: true // Asegúrate de cargar la relación del producto
        },
        payments: true
      },
      select: {
        id: true,
        status: true,
        orderAt: true,
        isQuote: true,
        client: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        },
        addedBy: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        },
        orderLines: {
          id: true,
          product_quantity: true,
          product_unit_price: true,
          product: {
            id: true,
            name: true,
            price: true
          }
        },
        payments: {
          id: true,
          amount: true,
          paymentType: true,
          paymentDate: true
        }
      }
    });

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
      });
    }

    this.checkQuoteStatus(order);
    return order;
}

  private getTotalPrice(order: OrderEntity): number {
    return order.orderLines.reduce((sum, line) => sum + (line.product_unit_price * line.product_quantity), 0);
  }

  private getTotalPaid(order: OrderEntity): number {
    return order.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  }

  private async checkQuoteStatus(order: OrderEntity) {
    if (!order.isQuote) return;

    const now = new Date();
    const totalAmount = this.getTotalPrice(order);
    const totalPaid = this.getTotalPaid(order);
    const fifteenDaysLater = new Date(order.orderAt);
    fifteenDaysLater.setDate(fifteenDaysLater.getDate() + 15);

    if (totalPaid >= totalAmount * 0.5) {
      order.isQuote = false;
      order.status = OrderStatus.CONFIRMED;
    } else if (totalPaid > 0) {
      order.status = OrderStatus.FROZEN;
    } else if (now > fifteenDaysLater) {
      order.status = OrderStatus.EXPIRED;
    }

    await this.orderRepository.save(order);
  }

  async setPayments(orderId: number, paymentDtos: CreatePaymentDto[]) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['payments', 'orderLines'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const totalPaid = this.getTotalPaid(order);
    const totalPrice = this.getTotalPrice(order);
    const newPaymentsTotal = paymentDtos.reduce((sum, payment) => sum + payment.amount, 0);

    if (totalPaid + newPaymentsTotal > totalPrice) {
      throw new UnprocessableEntityException({
        code: 'PAYMENT_AMOUNT_EXCEEDS_TOTAL_PRICE',
        message: 'Payment amount exceeds total price',
      });
    }

    const newPayments = this.createPaymentEntities(paymentDtos, order);
    order.payments = [...(order.payments || []), ...newPayments];
    await this.orderRepository.save(order);

    return await this.findOne(order.id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderLines', 'client', 'payments'],
    });
  
    if (!order) {
      throw new NotFoundException('Order not found');
    }
  
    // Si hay cambios en las líneas de pedido, actualizar cada una
    if (updateOrderDto.orderLines && updateOrderDto.orderLines.length > 0) {
      const updatedOrderLines = await this.updateOrderLines(order, updateOrderDto.orderLines);

      order.orderLines = updatedOrderLines;
      await this.orderRepository.save(order);
    }

    // Si se han realizado pagos, actualizarlos
    if (updateOrderDto.payments) {
      await this.setPayments(order.id, updateOrderDto.payments);
    } 

    // Guardar el pedido actualizado en la base de datos
  
    return await this.findOne(order.id);
  }
  
  private async updateOrderLines(order: OrderEntity, updatedOrderLines: OrderLineDto[]): Promise<OrderLineEntity[]> {
    const updatedLines: OrderLineEntity[] = [];

    // Para cada línea de pedido, verificamos si hay cambios y aplicamos el nuevo precio solo a la cantidad adicional
    for (const updatedLine of updatedOrderLines) {
      
      const existingLine = order.orderLines.find(async line => {
        const orderLine = await this.olRepository.findOne({
          where: {id: line.id},
          relations: {product: true}
        })
        return orderLine.product.id === updatedLine.productId
      });

      const product = await this.productService.findOne(updatedLine.productId);
  
      if (existingLine) {
        // Si la línea ya existe, actualizamos la cantidad y el precio de la cantidad adicional
        const originalQuantity = existingLine.product_quantity;
        const newQuantity = updatedLine.product_quantity;
  
        // Si el cliente solo aumenta la cantidad, se mantiene el precio original para la cantidad inicial
        if (newQuantity > originalQuantity) {
          if (product.price === existingLine.product_unit_price) {
            existingLine.product_quantity = newQuantity;
          } else {
            const newLine = new OrderLineEntity();
            newLine.order = order;
            newLine.product = product;
            newLine.product_quantity = newQuantity - originalQuantity;
            newLine.product_unit_price = product.price;
            updatedLines.push(newLine);
          }
        } else {
          existingLine.product_quantity = updatedLine.product_quantity;
        }
        
        updatedLines.push(existingLine);
      } else {
        // Si la línea es nueva, creamos una nueva línea de pedido
        const newLine = new OrderLineEntity();
        newLine.order = order;
        newLine.product = product;
        newLine.product_quantity = updatedLine.product_quantity;
        newLine.product_unit_price = product.price;
        updatedLines.push(newLine);
      }
    }
  
    return updatedLines;
  }
  
  async getOrdersByStatus(status: OrderStatus) {
    return await this.orderRepository.find({
      where: { status },
      relations: ['orderLines', 'client', 'payments'],
    });
  }

}