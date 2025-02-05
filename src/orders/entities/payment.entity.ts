import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { Exclude } from "class-transformer";
import { PaymentType } from "../enums/payment-types.enum";

@Entity({ name: 'payments' })
export class PaymentEntity {
      //* Establece el id como auto incremental
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'enum', enum: PaymentType})
  paymentType: PaymentType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({default: null})
  transactionId: string;

  @CreateDateColumn()
  paymentDate: Date;

  @ManyToOne(() => OrderEntity, order => order.payments)
  @Exclude()  // Evita que la propiedad 'order' se serialice
  order: OrderEntity;
}
