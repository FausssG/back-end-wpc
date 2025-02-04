// profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;
}
