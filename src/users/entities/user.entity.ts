import { BudgetEntity } from 'src/budgets/entities/budget.entity';
import { ClientEntity } from 'src/clients/entities/client.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { PlanningEntity } from 'src/planning/entities/planning.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { Role } from 'src/utility/common/user-roles.enum';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({ type: 'uuid', unique: true, nullable: true, name: 'activation_token' })
  activationToken: string;
  
  @Column({ type: 'uuid', unique: true, nullable: true, name: 'reset_password_token' })
  resetPasswordToken: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Timestamp;

  @OneToMany(() => OrderEntity, (order) => order.addedBy)
  orders: OrderEntity[];

  @OneToMany(() => PlanningEntity, (planning) => planning.addedBy)
  plannings: PlanningEntity[];

  @OneToMany(() => BudgetEntity, (budget) => budget.addedBy)
  budgets: BudgetEntity[];

  @OneToMany(() => ProductEntity, (product) => product.addedBy)
  products: ProductEntity[];

  @OneToMany(() => ClientEntity, (client) => client.addedBy)
  clients: ClientEntity[];
}
