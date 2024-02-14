import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
