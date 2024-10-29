
import { Roles } from "src/utility/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    mail: string;

    @Column({select:false})
    password: string;

    @Column()
    name: string;

    @Column()
    apellido: string;

    @Column({type:'enum', enum:Roles, default:Roles.USER})
    roles: Roles;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;



}