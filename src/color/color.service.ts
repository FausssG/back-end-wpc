import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColorEntity } from './entities/color.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorService {
  
  constructor(
    @InjectRepository(ColorEntity)
    private readonly colorRepository: Repository<ColorEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}


  async create(id:number, createColorDto: CreateColorDto):Promise<ColorEntity> {

    try {
      const product= await this.productRepository.findOne({where: {id}});

      if (!product) throw new NotFoundException(`El producto con id ${id} no existe`);
  
      const color=this.colorRepository.create(createColorDto);
  
      color.product = product;
  
      return await this.colorRepository.save(color);
    } catch (error) {
      if (error.errno === 1062) {
        throw new BadRequestException(`the name ${createColorDto.name} is aleady in use`);
      }

      throw error;
    }

  }

  findAll():Promise<ColorEntity[]> {
    return this.colorRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} color`;
  }

  update(id: number, updateColorDto: UpdateColorDto) {
    return `This action updates a #${id} color`;
  }

  remove(id: number) {
    return `This action removes a #${id} color`;
  }
}
