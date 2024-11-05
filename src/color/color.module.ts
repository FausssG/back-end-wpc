import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from './entities/color.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ColorEntity,ProductEntity])],
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService]
})
export class ColorModule {}
