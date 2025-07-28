  import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
  } from '@nestjs/common';
  import { OrdersService } from './orders.service';
  import { Auth } from 'src/utility/decorators/auth.decorator';
  import { Resource } from 'src/roles/enums/resource.enum';
  import { Action } from 'src/roles/enums/action.enum';
  import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
  import { CreateOrderDto } from './dto/create-order.dto';
  import { UserEntity } from 'src/users/entities/user.entity';
  import { OrderEntity } from './entities/order.entity';
  import { CreatePaymentDto } from './dto/create-payment.dto';
  import { UpdateOrderDto } from './dto/update-order.dto';
  import { OrderStatus } from './enums/order-status.enum';
  @Controller('orders')
  export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    //! TODO cambiar Resource a Orders
    @Auth([{ resource: Resource.users, actions: [Action.create] }])
    @Post()
    async create(
      @Body() createOrderDto: CreateOrderDto,
      @CurrentUser() currentUser: UserEntity,
    ): Promise<OrderEntity> {
      return await this.ordersService.create(createOrderDto, currentUser);
    }

    @Patch('payments/:id')
    async setPayments(@Param('id') id: string, @Body() payments: CreatePaymentDto[]) {
      return await this.ordersService.setPayments(+id, payments)
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
      return await this.ordersService.update(+id, updateOrderDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
      return await this.ordersService.findOne(+id);
    }

    @Get()
    async findAll() {
      return await this.ordersService.findAll();
    }

    @Get()
    async getOrdersByStatus(@Param('status') status: OrderStatus) {
      return await this.ordersService.getOrdersByStatus(status);
    }
  }