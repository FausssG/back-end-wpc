import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from 'src/color/entities/color.entity';
import { ColorModule } from 'src/color/color.module';
import { ColorController } from 'src/color/color.controller';
import { ColorService } from 'src/color/color.service';

@Module({
  controllers: [ProductsController, ColorController],
  providers: [ProductsService, ColorService],
  imports: [TypeOrmModule.forFeature([ProductEntity, ColorEntity])],
  exports:[ProductsService]
})
export class ProductsModule {}
