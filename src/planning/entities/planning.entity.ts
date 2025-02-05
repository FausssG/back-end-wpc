
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'planning'})
export class PlanningEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status:string;

    @Column()
    createdDate: Date;

    @Column()
    dateFrom: Date;

    @Column()
    dateUntil: Date;

    @Column()
    createdBy: number;

    @ManyToOne(()=> UserEntity, (user)=>user.plannings)
    addedBy:UserEntity;

    // @OneToMany(()=> OrderLineEntity, (orderLine)=>orderLine.planning)
    // orderLines: OrderLineEntity[];
    

}
