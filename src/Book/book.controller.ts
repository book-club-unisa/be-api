import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './Book';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('books')
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

  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Book>> {
    limit = limit > 100 ? 100 : limit;
    return this.BookService.paginate({
      page,
      limit,
      route: 'http://localhost:4000/books',
    });
  }
}
