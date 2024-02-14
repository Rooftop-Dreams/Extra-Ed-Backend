import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("books")
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      return this.bookService.create(createBookDto, files);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.bookService.remove(id);
  }
}
