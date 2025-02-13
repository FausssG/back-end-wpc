import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { PaymentEntity } from './entities/payment.entity';
import { OrderLineEntity } from './entities/order-line.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderLineEntity, PaymentEntity]), ClientsModule, ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [TypeOrmModule.forFeature([OrderLineEntity])]
})
export class OrdersModule {}
