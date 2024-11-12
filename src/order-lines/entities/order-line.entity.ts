import { BudgetEntity } from "src/budgets/entities/budget.entity";
import { PlanningEntity } from "src/planning/entities/planning.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "orderLines" })
export class OrderLineEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: 'decimal' , precision: 10, scale: 2, default: 0.0})
    unitPrice:number;

    @Column()
    quantity:number;


    @ManyToOne(()=> BudgetEntity, (budget)=>budget.orderLines)
    budget: BudgetEntity;


    @ManyToOne(()=> PlanningEntity, (planning)=> planning.orderLines)
    planning: PlanningEntity;

    @ManyToOne(()=> ProductEntity, (product)=>product.orderLines)
    product:ProductEntity;
    



}
