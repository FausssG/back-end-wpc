import { OrderEntity } from 'src/orders/entities/order.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { IdentificationTypeEnum } from '../enums/identification-type.enum';
import { TaxResponsibilityEnum } from '../enums/tax-responsability.enum';
import { ClientType } from '../enums/client-type.enum';

@Entity('clients')
export class ClientEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ClientType, default: ClientType.PUBLICO })
    type: ClientType;

    @Column({ length: 255 })
    firstName: string;

    @Column({ length: 255 })
    lastName: string;

    @Column({ length: 255, nullable: true })
    address_street: string;

    // @Column({ length: 255, nullable: true })
    // address_street_2: string;

    @Column({ length: 100, nullable: true })
    city: string;

    @Column({ length: 100, nullable: true })
    state: string;

    @Column({ length: 20, nullable: true })
    postal_code: string;

    @Column({ length: 100, nullable: true })
    country: string;

    @Column({ type: 'enum', enum: IdentificationTypeEnum, default: IdentificationTypeEnum.CUIT })
    identification_type: IdentificationTypeEnum;

    @Column({ length: 50, unique: true })
    @Index()  // Índice para mejorar las búsquedas
    identification_number: string;

    @Column({ type: 'enum', enum: TaxResponsibilityEnum, 
        default: TaxResponsibilityEnum.CONSUMIDOR_FINAL 
    })
    tax_responsibility: TaxResponsibilityEnum;

    @Column({ length: 50, nullable: true })
    phone: string;

    @Column({ length: 50, nullable: true })
    mobile: string;

    @Column({ length: 255, nullable: true })
    @Index()  // Índice para mejorar las búsquedas
    email: string;

    @ManyToOne(() => UserEntity, (user) => user.clients, { nullable: false })
    modifiedBy: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.clients, { nullable: false })
    addedBy: UserEntity;

    @OneToMany(()=> OrderEntity, (order)=>order.client)
    orders: OrderEntity[];

}