import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { PaymentEntity } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderLineEntity } from './entities/order-line.entity';
import { ProductsService } from 'src/products/products.service';
import { ProductEntity } from 'src/products/entities/product.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { OrderLineDto } from './dto/order-lines.dto';
import { ClientsService } from 'src/clients/clients.service';

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
    const orderEntity = new OrderEntity();
    orderEntity.addedBy = currentUser;

    const client = await this.clientService.findOne(createOrderDto.clientId);
    orderEntity.client = client;

    if (createOrderDto.payments) {
      const paymentEntities = createOrderDto.payments.map((paymentDto) => {
        const payment = new PaymentEntity();
        Object.assign(payment, paymentDto);
        payment.order = orderEntity; // Asocia el pago con la orden
        return payment;
      });
      orderEntity.payments = paymentEntities;
    }

    const order = await this.orderRepository.save(orderEntity);

    let olEntity: {
      order: OrderEntity;
      product: ProductEntity;
      product_quantity: number;
      product_unit_price: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderLines.length; i++) {
      const productId = createOrderDto.orderLines[i].productId;
      const product = await this.productService.findOne(productId);
      const product_unit_price = product.price;
      const product_quantity = createOrderDto.orderLines[i].product_quantity;
      olEntity.push({ order, product, product_quantity, product_unit_price });
    }

    const ol = await this.olRepository
      .createQueryBuilder()
      .insert()
      .into(OrderLineEntity)
      .values(olEntity)
      .execute();

    return await this.findOne(order.id);
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: number) {
    const order = this.orderRepository.findOne({
      where: { id },
      relations: {
        client: true,
        addedBy: true,
        orderLines: true,
        payments: true,
      },
      select: {
        addedBy: {
          email: true,
          firstName: true,
          lastName: true
        }
      }
    });

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
      });
    }
    
    return order;
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async setPayments(orderId: number, paymentDtos: CreatePaymentDto[]) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['payments', 'orderLines'],
    });
  
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Agregar nuevos pagos
    const newPayments = paymentDtos.map((paymentDto) => {
      const payment = new PaymentEntity();
      Object.assign(payment, paymentDto);
      payment.order = order;
      return payment;
    });
  
    order.payments = [...(order.payments || []), ...newPayments];

    return await this.orderRepository.save(order);;
  }
  
}
