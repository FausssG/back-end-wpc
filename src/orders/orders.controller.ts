import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Auth } from 'src/utility/decorators/auth.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
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

  @Patch(':id')
  async setPayments(@Param('id') id: string, @Body() payments: any) {
    return await this.ordersService.setPayments(+id, payments)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOne(+id);
  }
}
