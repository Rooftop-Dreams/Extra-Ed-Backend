import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BookEntity } from "src/book/entities/book.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { Payment } from "src/payment/entities/payment.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  create(createAdminDto: CreateAdminDto) {
    return "This action adds a new admin";
  }

  async publishBook(bookId: string) {
    try {
      // const user = await this.userRepository.findOne({ where: { id: userId } });
      const book = await this.bookRepository.findOne({ where: { id: bookId } });
      if (!book) {
        throw new HttpException(
          `Book with a given id ${bookId} not found!`,
          HttpStatus.BAD_REQUEST,
        );
      }
      book.is_available = true;
      const updatedBook = await this.bookRepository.save(book);

      return updatedBook;
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
