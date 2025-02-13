
import { OrderLineEntity } from "src/orders/entities/order-line.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlanningStatus } from "../enums/planning-status.enum";

@Entity({name: 'planning'})
export class PlanningEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: PlanningStatus, default: PlanningStatus.DRAFT })
    status: PlanningStatus;

    @Column()
    createdDate: Date;

    @Column()
    dateFrom: Date;

    @Column()
    dateUntil: Date;

    @ManyToOne(()=> UserEntity, (user)=>user.plannings)
    addedBy:UserEntity;

    @OneToMany(() => OrderLineEntity, orderLine => orderLine.planning, { cascade: true })
    orderLines: OrderLineEntity[];

}
