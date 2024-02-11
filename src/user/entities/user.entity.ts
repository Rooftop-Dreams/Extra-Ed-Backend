// User.ts
import { Payment } from "src/payment/entities/payment.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: "false" })
  isDeleted: boolean;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
