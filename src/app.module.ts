import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { dataSourceOptions } from '../db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorsModule } from './colors/colors.module';
import { OrdersModule } from './orders/orders.module';
import { PlanningModule } from './planning/planning.module';
import { CurrentUserMiddleware } from './utility/common/middlewares/current-user.middleware';
import { MailsModule } from './mails/mails.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ClientsModule } from './clients/clients.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    ColorsModule,
    OrdersModule,
    PlanningModule,
    MailsModule,
    AuthModule,
    UsersModule,
    RolesModule,
    ClientsModule,
    ProfilesModule
  ],
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
