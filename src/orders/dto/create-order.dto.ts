import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { OrderLineDto } from "./order-lines.dto";
import { CreatePaymentDto } from "./create-payment.dto";

export class CreateOrderDto {

  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @Type(() => OrderLineDto)
  @ValidateNested()
  orderLines: OrderLineDto[];

  @Type(() => CreatePaymentDto)
  @ValidateNested()
  payments: CreatePaymentDto[];
  
}
