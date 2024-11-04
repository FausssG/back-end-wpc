import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from './entities/color.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([ColorEntity]),ProductsModule],
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService]
})
export class ColorModule {}
