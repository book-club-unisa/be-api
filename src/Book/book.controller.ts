import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { BookDto } from 'src/dtos/book.dto';
import { BookService } from './book.service';

@Controller()
export class BookController {
  constructor(private readonly BookService: BookService) {}

  @Get('/searchBook/:bookTitle')
  async getBookByTitle(@Param('bookTitle') bookTitle: string) {
    if (bookTitle.length < 2)
      throw new HttpException(
        'Title Field must contain 2 or more letters',
        400,
      );
    else return this.BookService.findBooksByTitle(bookTitle);
  }

  @Post('/saveBook')
  async saveBook(@Body() bookDto: BookDto) {
    return this.BookService.saveBook(bookDto);
  }
}
