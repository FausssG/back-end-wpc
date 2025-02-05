import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

//DTO de lineas de pedido
export class OrderLineDto {

  //ID del producto
  @IsNotEmpty({message: 'Product can not be empty.'})
  @IsNumber()
  productId: number;

  //Cantidad del producto
  @IsNumber({}, { message: 'Quantity should be number.' })
  @IsPositive({message: 'Quantity can not be negative.'})
  product_quantity: number;

}