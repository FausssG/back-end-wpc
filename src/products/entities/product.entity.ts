import {Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn} from "typeorm";
import { ColorEntity } from "src/color/entities/color.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { OrderLineEntity } from "src/order-lines/entities/order-line.entity";
import { ProfileEntity } from "src/profile/entities/profile.entity";

@Entity ({name:'products'})
@Unique(['color', 'profile']) // 🚀 Evita combinaciones duplicadas
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column('float')
    price: number;
    
    @Column({ default: true })
    status: boolean;
    
    @CreateDateColumn()
    createdAt:Timestamp;

    @UpdateDateColumn()
    updatedAt:Timestamp;

    @ManyToOne(() => ColorEntity, { eager: true })
    color: ColorEntity;

    @ManyToOne(() => ProfileEntity, { eager: true })
    profile: ProfileEntity;

    @OneToMany(()=>OrderLineEntity,(orderLine)=>orderLine.product)
    orderLines:OrderLineEntity[];

    @ManyToOne(()=>UserEntity, (user)=>user.products)
    addedBy:UserEntity;

}
