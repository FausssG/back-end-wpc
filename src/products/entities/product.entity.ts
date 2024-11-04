import {Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateColumn} from "typeorm";
import { ColorEntity } from '../../color/entities/color.entity';
import { UserEntity } from "src/users/entities/user.entity";

@Entity ({name:'products'})
export class ProductEntity {

    

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    @Column()
    description:string;

    @Column({type:'decimal',precision:10,scale:2,default:0})
    price: number;

    @Column()
    stock:number;

    @Column('simple-array')
    images:string[]; 

    @CreateDateColumn()
    createdAt:Timestamp;

    @UpdateColumn()
    updatedAt:Timestamp;

    @OneToMany(()=>ColorEntity, (color)=>color.addedBy)
    colorId:ColorEntity[];

    @ManyToOne(()=>UserEntity,(user)=>user.products)
    addedBy:UserEntity;

    @ManyToMany(()=>OrderLineEntity,(orderLine)=>orderLine.addedBy)
    orderLine:OrderLineEntity[];

}
