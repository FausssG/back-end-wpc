import { ClientEntity } from 'src/clients/entities/client.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { PlanningEntity } from 'src/planning/entities/planning.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { RoleEntity } from 'src/roles/entities/role.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @OneToMany(() => ProductEntity, (product) => product.addedBy)
  products: ProductEntity[];

  @OneToMany(() => ClientEntity, (client) => client.addedBy)
  clients: ClientEntity[];

  @ManyToOne(() => RoleEntity, (role) => role.users)
  role: RoleEntity;
}
