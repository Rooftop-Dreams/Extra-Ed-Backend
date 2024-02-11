// User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Payment } from "./Payment";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @Column()
  phone: string;

  @Column()
  grade: number;

  @Column()
  gener: number;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
