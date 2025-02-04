import { Module } from '@nestjs/common';
import { ColorsModule } from 'src/color/colors.module';
import { ProfilesModule } from 'src/profile/profiles.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), ColorsModule, ProfilesModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[ProductsService]
})
export class ProductsModule {}
