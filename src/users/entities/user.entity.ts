
import { BudgetEntity } from "src/budgets/entities/budget.entity";
import { ClientEntity } from "src/clients/entities/client.entity";
import { OrderEntity } from "src/orders/entities/order.entity";
import { PlanningEntity } from "src/planning/entities/planning.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { Roles } from "src/utility/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, OneToMany, OrderedBulkOperation, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
// import { ProductEntity } from '../../products/entities/product.entity';

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    email: string;

    @Column({select:false})
    password: string;

    @Column()
    name: string;  

    @Column()
    lastName: string;

    @Column({type:'enum', enum:Roles, default:Roles.USER})
    roles: Roles;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToMany(()=> OrderEntity, (order)=>order.addedBy)
    orders: OrderEntity[];

    @OneToMany(()=> PlanningEntity, (planning)=>planning.addedBy)
    plannings: PlanningEntity[];

    @OneToMany(()=> BudgetEntity, (budget)=>budget.addedBy)
    budgets: BudgetEntity[];

    @OneToMany(()=> ProductEntity, (product)=>product.addedBy)
    products: ProductEntity[];

    @OneToMany(()=> ClientEntity, (client)=> client.addedBy)
    clients: ClientEntity[];

}