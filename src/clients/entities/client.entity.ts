import { OrderEntity } from 'src/orders/entities/order.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity('clients')
export class ClientEntity {

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
    addedBY:UserEntity;

    @OneToMany(()=> OrderEntity, (order)=>order.client)
    orders: OrderEntity[];

}
