import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity('clients')
export class Client {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    docNumber: string;

    @Column()
    name: string;

    @Column()
    addedBy: number;

    @Column()
    modifiedBy: number;

    @ManyToOne(()=> UserEntity, (user)=>user.clients)
    user:UserEntity;

    @OneToMany(()=> OrdersEntity, (order)=>order.clients)
    orders: OrdersEntity[];

}
