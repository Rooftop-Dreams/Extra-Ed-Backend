// Book.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Payment } from "./Payment";
import { Category } from "./Category";

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  book_id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  is_available: boolean;

  @Column()
  category_id: number;

  @ManyToOne(() => Category, (category) => category.books)
  category: Category;

  @Column()
  grade: number;

  @Column()
  cover_image_url: string;

  @Column()
  pdf_url: string;

  @Column()
  created_at: Date;

  @OneToMany(() => Payment, (payment) => payment.book)
  payments: Payment[];
}
