// product.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ColorsService } from 'src/colors/colors.service';
import { ProfilesService } from '../profiles/profiles.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private colorService: ColorsService,
    private profileService: ProfilesService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    // Validar si la combinación ya existe
    const existingColor = await this.colorService.findOne(
      createProductDto.colorId,
    );

    const existingProfile = await this.profileService.findOne(
      createProductDto.profileId,
    );

    const product = this.productRepository.create(createProductDto);

    product.color = existingColor;

    product.profile = existingProfile;

    product.addedBy = currentUser;

    return await this.saveProduct(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product)
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Producto no encontrado',
      });

    const { colorId, profileId } = updateProductDto;

    if (colorId) {
      const existingColor = await this.colorService.findOne(colorId);
      product.color = existingColor;
    }

    if (profileId) {
      const existingProfile = await this.profileService.findOne(profileId);
      product.profile = existingProfile;
    }

    await this.productRepository.merge(product, updateProductDto);

    return await this.saveProduct(product);
  }

  private async saveProduct(product: ProductEntity) {
    try {
      return await this.productRepository.save(product);
    } catch (error) {
      if ((error.code = 'ER_DUP_ENTRY')) {
        throw new ConflictException({
          code: 'PRODUCT_ALREADY_EXIST',
          message:
            'Ya existe un producto con esta combinación de color y perfil',
        });
      }
      throw new InternalServerErrorException();
    }
  }

  async changeStatus(id: number, status: boolean) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product)
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Producto no encontrado',
      });

    if (status === product.status) throw new BadRequestException({code: 'PRODUCT_STATUS_NOT_CHANGED', message: 'El estatus del producto no ha cambiado'});

    product.status = status;
    
    await this.saveProduct(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) throw new NotFoundException({code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado'});

    try {
      await this.productRepository.remove(product);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
