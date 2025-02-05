import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "src/products/entities/product.entity";
import { OrderEntity } from "./order.entity";


//Una relación muchos a muchos con atributos se transforma en una nueva entidad 
@Entity({ name: "orders_lines" })
export class OrderLineEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //Precio unitario
  @Column({type: "decimal", precision: 10, scale: 2, default: 0.0})
  product_unit_price: number;

  //Cantidad del producto
  @Column()
  product_quantity: number;

  //Un pedido puede debe tener una o muchas lineas de pedido, una linea de pedido pertenece a un unico pedido
  @ManyToOne((type) => OrderEntity, order => order.orderLines)
  order: OrderEntity;
    
  //Un producto puede estar en muchas lineas de pedido, una linea de pedido tiene un unico producto
  @ManyToOne((type) => ProductEntity, product => product.orderLines)
  product: ProductEntity;
}