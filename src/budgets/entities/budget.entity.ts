import { OrderLineEntity } from "src/order-lines/entities/order-line.entity";
import { OrderEntity } from "src/orders/entities/order.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "budgets" })
export class BudgetEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createdBy: number;

    @Column()   
    expirationDate: Date;

    @ManyToOne(()=> UserEntity, (user)=>user.budgets)
    addedBy: UserEntity;

    @OneToMany(()=> OrderLineEntity, (orderLine)=>orderLine.budget)
    orderLines:OrderLineEntity[];

    @OneToOne(()=> OrderEntity, (order) => order.budget)
    order: OrderEntity;


}
