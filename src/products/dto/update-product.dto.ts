// update-product.dto.ts
import { IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  colorId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  profileId?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

}
