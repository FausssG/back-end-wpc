
import { Roles } from "src/utility/common/user-roles.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('users')

export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    mail: string;
    @Column()
    password: string;
    @Column()
    name: string;
    @Column()
    surname: string;
    @Column()
    dateCreation: Date;
    @Column({type:'enum', enum:Roles, array: true, default:[Roles.USER]})
    roles: Roles[];

}