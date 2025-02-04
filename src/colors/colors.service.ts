import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColorEntity } from './entities/color.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorsService {
  
  constructor(
    @InjectRepository(ColorEntity)
    private readonly colorRepository: Repository<ColorEntity>,
  ) {}

  async create(createColorDto: CreateColorDto) {
    const newColor = await this.colorRepository.create(createColorDto);

    try {
      return await this.colorRepository.save(newColor);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    const color = await this.colorRepository.findOneBy({id});

    if (!color) throw new NotFoundException({
      code: 'COLOR_NOT_FOUND',
      message: 'Color no encontrado',
    });

    return color;
  }

    async remove(id: number) {
      
      const color = await this.colorRepository.findOne({where: {id}});
  
      if (!color) throw new NotFoundException({
        code: 'COLOR_NOT_FOUND',
        message: 'Color no encontrado',
      })
  
      try {
        return await this.colorRepository.delete(id);
      } catch (error) {
        if(error.code === 'ER_ROW_IS_REFERENCED_2') throw new UnprocessableEntityException({code: 'COLOR_HAS_PRODUCTS', message: 'El color tiene productos asociados'});
  
        throw new InternalServerErrorException();
      }
    }

    async findAll() {
      return this.colorRepository.find();
    }

}
