import { Injectable } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BookEntity } from "./entities/book.entity";
import { Repository } from "typeorm";

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookEntity> {
    const newBook = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(newBook);
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
