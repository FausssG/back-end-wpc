import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "budgets" })
export class Budget {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createdBy: number;

    @Column()   
    expirationDate: Date;

    @ManyToOne(()=> UserEntity, (user)=>user.budgets)
    user:UserEntity;

    @OneToMany(()=> BudgetLineEntity, (budgetLine)=>budgetLine.budget)
    budgetLines: BudgetLineEntity[];

    @OneToOne(()=> OrderEntity, (order)=>order.budget)
    order:OrderEntity;


}
