
import { Roles } from "src/utility/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, OneToMany, OrderedBulkOperation, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
// import { ProductEntity } from '../../products/entities/product.entity';

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    mail: string;

    @Column({select:false})
    password: string;

    @Column()
    name: string;  

    @Column()
    apellido: string;

    @Column({type:'enum', enum:Roles, default:Roles.USER})
    roles: Roles;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToMany(()=> OrderEntity, (order)=>order.user)
    orders: orderEntity[];

    @OneToMany(()=> PlanningEntity, (planning)=>planning.user)
    plannings: PlanningEntity[];

    @OneToMany(()=> BudgetEntity, (budget)=>budget.user)
    budgets: BudgetEntity[];

    @OneToMany(()=> ProductEntity, (product)=>product.user)
    products: ProductEntity[];

}