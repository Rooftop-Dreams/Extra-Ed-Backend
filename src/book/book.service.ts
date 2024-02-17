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

  async getPurchasedBooks(userId: string): Promise<BookEntity[]> {
    const purchasedBooks = await this.paymentRepository
      .createQueryBuilder("payment")
      .innerJoinAndSelect("payment.book", "book")
      .where("payment.user = :userId", { userId })
      .getMany();

    return purchasedBooks.map((payment) => payment.book);
  }

  async getUnpurchasedBooks(userId: string): Promise<BookEntity[]> {
    const purchasedBookIds = await this.paymentRepository
      .createQueryBuilder("book_entity")
      // .select("book_entity.id", "book_entity.title", "book_entity.decription")
      .where("book_entity = :userId", { userId })
      .getMany()
      .then((purchases) => purchases.map((purchase) => purchase.book));

    if (purchasedBookIds.length === 0) {
      return await this.bookRepository.find();
    }

    return await this.bookRepository
      .createQueryBuilder("book_entity")
      .where("book_entity.id NOT IN (:...purchasedBookIds)", {
        purchasedBookIds,
      })
      .getMany();
  }

  async findAll(userId: string): Promise<Omit<BookEntity, "pdf_url">[]> {
    const purchasedBooks = this.getPurchasedBooks(userId);
    const allBooks = await this.bookRepository.find();
    const booksWIthAndWithOurPdfUrl: Promise<Omit<BookEntity, "pdf_url">>[] =
      allBooks.map(async (book) => {
        const purchased = (await purchasedBooks).some(
          (purchasedBook) => purchasedBook.id === book.id,
        );
        return {
          ...(purchased ? book : { ...book, pdf_url: undefined }),
        } as any as Omit<BookEntity, "pdf_url">;
      });

    const booksWIthAndWithOurPdfUrls = await Promise.all(
      booksWIthAndWithOurPdfUrl,
    );

    return booksWIthAndWithOurPdfUrls;
  }

  async findOne(id: string): Promise<BookEntity> {
    return await this.bookRepository.findOneBy({ id });
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<BookEntity> {
    const bookToUpdate = await this.bookRepository.findOneBy({ id });
    if (!bookToUpdate) {
      return null;
    }

    const updatedBook = Object.assign(bookToUpdate, updateBookDto);
    return await this.bookRepository.save(updatedBook);
  }

  async remove(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }
}
