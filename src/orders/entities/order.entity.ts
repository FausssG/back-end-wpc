import { ClientEntity } from 'src/clients/entities/client.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { OrderLineEntity } from './order-line.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;

  @CreateDateColumn()
  orderAt: Date;

  @Column({ default: true })
  isQuote: boolean;

  // Configuración correcta para addedBy (usuario que creó el pedido)
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'addedById' }) // Nombre exacto de la columna en la BD
  addedBy: UserEntity;

  // Configuración correcta para client (cliente asociado)
  @ManyToOne(() => ClientEntity)
  @JoinColumn({ name: 'clientId' }) // Nombre exacto de la columna en la BD
  client: ClientEntity;

  @OneToMany(() => PaymentEntity, (payment) => payment.order, { cascade: true })
  payments: PaymentEntity[];

  @OneToMany(() => OrderLineEntity, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  orderLines: OrderLineEntity[];
  
}
