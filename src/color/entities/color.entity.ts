import { ProductEntity } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'color'})
export class ColorEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @OneToMany(()=>ProductEntity, (product)=>product.color)
    product:ProductEntity[]

}
