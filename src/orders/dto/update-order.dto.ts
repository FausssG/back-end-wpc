import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderLineDto } from './order-lines.dto';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdateOrderDto {

  @Type(() => OrderLineDto)
  @ValidateNested()
  orderLines: OrderLineDto[];

  @Type(() => CreatePaymentDto)
  @ValidateNested()
  payments: CreatePaymentDto[];

}
