import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
} from 'class-validator';
import { TaxResponsibilityEnum } from '../enums/tax-responsability.enum';
import { IdentificationTypeEnum } from '../enums/identification-type.enum';
import { ClientType } from '../enums/client-type.enum';

export class UpdateClientDto {
  @IsOptional()
  @IsEnum(ClientType, {message: 'Tipo de cliente inválido'})
  type: ClientType;

  @IsOptional()
  @IsEnum(IdentificationTypeEnum, {
    message: 'Tipo de identificación inválido',
  })
  identification_type?: IdentificationTypeEnum;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El número de identificación no puede estar vacío' })
  identification_number?: string;

  @IsOptional()
  @IsEnum(TaxResponsibilityEnum, { message: 'Responsabilidad fiscal inválida' })
  tax_responsibility?: TaxResponsibilityEnum;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address_street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsPhoneNumber(null, { message: 'Número de teléfono inválido' })
  phone?: string;

  @IsOptional()
  @IsPhoneNumber(null, { message: 'Número de celular inválido' })
  mobile?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  email?: string;
}
