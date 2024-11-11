import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { dataSourceOptions } from '../db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { PlanningModule } from './planning/planning.module';
import { BudgetsModule } from './budgets/budgets.module';
import { PaymentsModule } from './payments/payments.module';
import { CurrentUserMiddleware } from './utility/common/middlewares/current-user.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    OrdersModule,
    PlanningModule,
    BudgetsModule,
    PaymentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {

  configure(consumer:MiddlewareConsumer) {
    consumer
    .apply(CurrentUserMiddleware)
    .forRoutes({path:'*',method:RequestMethod.ALL});

  }


}
