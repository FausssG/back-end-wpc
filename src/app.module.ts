import { Module } from '@nestjs/common';
import { dataSourceOptions } from '../db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ColorModule } from './color/color.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    ProductsModule,
    ColorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
