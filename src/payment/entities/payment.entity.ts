// Payment.ts
import { IsOptional } from "class-validator";
import { BookEntity } from "src/book/entities/book.entity";
import { UserEntity } from "src/user/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsOptional()
  @ManyToOne(() => UserEntity, (user) => user.payments)
  user: UserEntity;

  @IsOptional()
  @ManyToOne(() => BookEntity, (book) => book.payments)
  book: BookEntity;

  @IsOptional()
  @Column()
  amount: number;

  @IsOptional()
  @Column()
  payment_date: Date;

  @IsOptional()
  @Column()
  payment_method: string;

  @IsOptional()
  @Column()
  status: string;
}
