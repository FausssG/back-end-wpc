import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'orders'})
export class Order {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    state:string;

    @Column()
    orderDate:Date;

    @Column()
    createdBy:number;

    @Column()
    orderedBy:number;

    @Column()
    estimatedDeliveryDate:Date;

    @Column()
    orderId:number;

    @ManyToOne(()=> UserEntity, (user)=>user.orders)
    user:UserEntity;

    @OneToMany(()=> PaymentEntity, (payment)=>payment.order)
    payment:PaymentEntity[];

    @ManyToOne(()=> ClientEntity, (client)=>client.orders)
    client:ClientEntity;

    @OneToOne(()=> BudgetEntity, (budget)=>budget.order)
    budget:BudgetEntity;


}
