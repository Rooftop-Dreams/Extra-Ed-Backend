// Payment.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Column()
  book_id: number;

  @ManyToOne(() => Book, (book) => book.payments)
  book: Book;

  @Column()
  amount: number;

  @Column()
  payment_date: Date;

  @Column()
  payment_method: string;

  @Column()
  status: string;
}
