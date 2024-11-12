import { OrderEntity } from "src/orders/entities/order.entity";
import { Method } from "src/utility/common/payment-method.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "payments" })
export class PaymentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    paymentDate: Date;

    @Column()
    total: number;

    @Column({type:'enum', enum:Method, default:Method.CASH})
    method: Method;

    @Column()
    currency: string;

    @Column()
    orderId: number;

    @ManyToOne(()=> OrderEntity, (order)=>order.payments)
    order:OrderEntity;

}
