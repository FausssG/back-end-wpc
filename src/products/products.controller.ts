// product.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { Auth } from 'src/utility/decorators/auth.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Auth([{resource: Resource.users, actions: [Action.create]}])
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @CurrentUser() currentUser: UserEntity ): Promise<ProductEntity> {
    return this.productService.create(createProductDto, currentUser);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() currentUser: UserEntity ): Promise<ProductEntity> {
    return await this.productService.update(+id, updateProductDto, currentUser);
  }

  @Patch('activate/:id')
  async activate(@Param('id') id: string): Promise<void> {
    return await this.productService.changeStatus(+id, true);
  }

  @Patch('deActivate/:id')
  async deActivate(@Param('id') id: string): Promise<void> {
    return await this.productService.changeStatus(+id, false);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    return this.productService.findOne(+id);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }
}
