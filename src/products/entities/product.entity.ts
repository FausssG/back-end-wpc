import {Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn} from "typeorm";
import { ColorEntity } from "src/color/entities/color.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { OrderLineEntity } from "src/order-lines/entities/order-line.entity";

@Entity ({name:'products'})
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    @Column()
    description:string;

    @CreateDateColumn()
    createdAt:Timestamp;

    @UpdateDateColumn()
    updatedAt:Timestamp;

    @OneToMany(()=>ColorEntity, (color)=>color.product)
    colors:ColorEntity[];

    @OneToMany(()=>OrderLineEntity,(orderLine)=>orderLine.product)
    orderLines:OrderLineEntity[];

    @ManyToOne(()=>UserEntity, (user)=>user.products)
    addedBy:UserEntity;

}
