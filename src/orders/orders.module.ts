import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderLineEntity } from 'src/order-lines/entities/order-line.entity';
import { PaymentEntity } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderLineEntity, PaymentEntity])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
