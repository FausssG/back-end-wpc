import { ProductEntity } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'color'})
export class ColorEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({type: 'decimal' , precision: 10, scale: 2, default: 0.0})
    price: number;
  

    @ManyToOne(()=>ProductEntity, (product)=>product.colors)
    product: ProductEntity;

}
