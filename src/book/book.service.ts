import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BookEntity } from "./entities/book.entity";
import { Repository } from "typeorm";
import { Payment } from "src/payment/entities/payment.entity";
import { UserEntity } from "src/user/entities/user.entity";

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createBookDto: CreateBookDto, files: any): Promise<any> {
    try {
      let pdfPath: string;
      let coverPath: string;

      files.forEach((file) => {
        if (file.mimetype === "application/pdf") {
          pdfPath = file.path.replace(/\\/g, "/");
        } else if (file.mimetype.startsWith("image/")) {
          coverPath = file.path.replace(/\\/g, "/");
        }
      });

      createBookDto.cover_image_url = `${process.env.IMG_URL}${coverPath}`;
      createBookDto.pdf_url = `${process.env.IMG_URL}${pdfPath}`;

      const newBook = this.bookRepository.create(createBookDto);
      return await this.bookRepository.save(newBook);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async purchaseBook(userId: string, bookId: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const book = await this.bookRepository.findOne({ where: { id: bookId } });

      const purchase = new Payment();
      purchase.user = user;
      purchase.book = book;
      purchase.payment_date = new Date();

      return await this.paymentRepository.save(purchase);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getPurchasedBooks(userId: number): Promise<BookEntity[]> {
    return await this.bookRepository
      .createQueryBuilder("book")
      .innerJoin("book.purchases", "purchase")
      .where("purchase.user.id = :userId", { userId })
      .getMany();
  }

  async getUnpurchasedBooks(userId: number): Promise<BookEntity[]> {
    const purchasedBookIds = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("payment.bookId")
      .where("payment.userId = :userId", { userId })
      .getMany()
      .then((purchases) => purchases.map((purchase) => purchase.book_id));

    if (purchasedBookIds.length === 0) {
      return await this.bookRepository.find(); // If no books are purchased, return all books
    }

    return await this.bookRepository
      .createQueryBuilder("book")
      .where("book.id NOT IN (:...purchasedBookIds)", { purchasedBookIds })
      .getMany();
  }

  async findAll(): Promise<BookEntity[]> {
    return await this.bookRepository.find();
  }

  async findOne(id: string): Promise<BookEntity> {
    return await this.bookRepository.findOneBy({ id });
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<BookEntity> {
    const bookToUpdate = await this.bookRepository.findOneBy({ id });
    if (!bookToUpdate) {
      // Handle error: book not found
      return null;
    }

    const updatedBook = Object.assign(bookToUpdate, updateBookDto);
    return await this.bookRepository.save(updatedBook);
  }

  async remove(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }
}
