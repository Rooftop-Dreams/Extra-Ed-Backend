// Payment.ts
// import { BookEntity } from "src/book/entities/book.entity";
import { User } from "src/user/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";

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

  // @ManyToOne(() => BookEntity, (book) => book.payments)
  // book: BookEntity;

  @Column()
  amount: number;

  @Column()
  payment_date: Date;

  @Column()
  payment_method: string;

  @Column()
  status: string;
}
