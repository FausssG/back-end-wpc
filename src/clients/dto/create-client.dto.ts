import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { IdentificationTypeEnum } from '../enums/identification-type.enum';
import { TaxResponsibilityEnum } from '../enums/tax-responsability.enum';
import { ClientType } from '../enums/client-type.enum';

export class CreateClientDto {
  
  @IsEnum(ClientType)
  @IsNotEmpty()
  type: ClientType;

  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name: string;

  @IsEnum(IdentificationTypeEnum)
  @IsNotEmpty()
  identification_type: IdentificationTypeEnum;

  @IsString()
  @IsNotEmpty()
  @Length(7, 50)
  @Matches(/^\d+$/, { message: 'identification_number debe contener solo números' })
  identification_number: string;

  @IsEnum(TaxResponsibilityEnum)
  @IsNotEmpty()
  tax_responsibility: TaxResponsibilityEnum;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  address_street?: string;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  address_street_2?: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  city?: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  state?: string;

  @IsString()
  @IsOptional()
  @Length(0, 20)
  postal_code?: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  country?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  phone?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  mobile?: string;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  email?: string;

  @IsString()
  @IsOptional()
  tags?: string;
}
