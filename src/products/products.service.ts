import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ColorService } from 'src/color/color.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository:Repository<ProductEntity>,

    private readonly colorService:ColorService
  ){}
  
  async create(createProductDto: CreateProductDto):Promise<ProductEntity> {
    
    const product = this.productRepository.create(createProductDto);
    // product.addedBy=currentUser;
    return await this.productRepository.save(product);

  }

  findAll():Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async findOne(id: number) {

    const product= await this.productRepository.findOne({
      where:{id:id},
      relations:{
        colors:true,
      },
      select:{
        colors:{
          id:true,
          name:true,
          price:true,
        }
      }
    }
    );
    if(!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  // async update(id: number, updateProductDto:Partial<UpdateProductDto>,currentUser:UserEntity) {
  //   const product = await this.findOne(id);
  //   Object.assign(product,updateProductDto);
  //   // product.addedBy=currentUser;
  //   if (updateProductDto.d){
  //     const color = await this.colorService.findOne(+updateProductDto.colors);
  //     product.colors=[];
  //   }

  //   return await this.productRepository.save(product);
  // }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
