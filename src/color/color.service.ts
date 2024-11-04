import { Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColorEntity } from './entities/color.entity';
import { ProductsService } from '../products/products.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ColorService {
  
  constructor(@InjectRepository(ColorEntity) private readonly colorRepository:Repository<ColorEntity>,
  private readonly ProductsService:ProductsService
) {}


  async create(createColorDto: CreateColorDto, currentUser:UserEntity):Promise<ColorEntity> {
    const product= await this.ProductsService.findOne(createColorDto.productId);
    const color=this.colorRepository.create(createColorDto);
    color.product=product;
    color.addedBy=[currentUser];
    return await this.colorRepository.save(color);
  }

  findAll() {
    return `This action returns all color`;
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
