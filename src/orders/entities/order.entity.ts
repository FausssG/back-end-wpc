import { ClientEntity } from 'src/clients/entities/client.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ type: 'timestamp', nullable: true })
  quoteExpiresAt: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  addedBy: UserEntity;

  @ManyToOne(() => ClientEntity, (client) => client.orders)
  client: ClientEntity;

  @OneToMany(() => PaymentEntity, (payment) => payment.order, { cascade: true })
  payments: PaymentEntity[];

  @OneToMany(() => OrderLineEntity, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  orderLines: OrderLineEntity[];

  @AfterLoad()
  checkQuoteStatus() {
    const now = new Date();
    const totalAmount = this.orderLines.reduce((sum, line) => sum + (line.product_unit_price * line.product_quantity), 0);
    const totalPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const fifteenDaysLater = new Date(this.orderAt);
    fifteenDaysLater.setDate(fifteenDaysLater.getDate() + 15);
  
    if (totalPaid >= totalAmount * 0.5) {
      // Se convierte en pedido confirmado y entra en producción
      this.isQuote = false;
      this.status = OrderStatus.CONFIRMED;
    } else if (totalPaid > 0) {
      // Precio congelado porque se realizó un pago parcial
      this.isQuote = true;
      this.status = OrderStatus.FROZEN;
    } else if (now > fifteenDaysLater) {
      // No se pagó nada en 15 días, el presupuesto expira
      this.isQuote = true;
      this.status = OrderStatus.EXPIRED;
    }
  }
  
}
