// create-product.dto.ts
import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  colorId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  profileId: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
