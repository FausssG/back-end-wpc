import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { PaymentType } from '../enums/payment-types.enum';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'Payment type cannot be empty.' })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsNotEmpty({ message: 'Amount cannot be empty.' })
  @IsNumber({}, { message: 'Amount must be a number.' })
  amount: number;

  @IsNotEmpty({ message: 'Currency cannot be empty.' })
  @IsString({ message: 'Currency must be a string.' })
  currency: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: Date;
}
