import { BudgetEntity } from "src/budgets/entities/budget.entity";
import { ClientEntity } from "src/clients/entities/client.entity";
import { PaymentEntity } from "src/payments/entities/payment.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'orders'})
export class OrderEntity {

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
    addedBy:UserEntity;

    @OneToMany(()=> PaymentEntity, (payment)=>payment.order)
    payments:PaymentEntity[];

    @ManyToOne(()=> ClientEntity, (client)=>client.orders)
    client:ClientEntity;

    @OneToOne(()=> BudgetEntity, (budget)=>budget.order)
    @JoinColumn()
    budget:BudgetEntity;


}
