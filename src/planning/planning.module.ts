import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanningEntity } from './entities/planning.entity';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlanningEntity]), OrdersModule],
  controllers: [PlanningController],
  providers: [PlanningService],
})
export class PlanningModule {}
