import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { BookDto } from 'src/dtos/book.dto';
import { Book } from 'src/Entities/Book';
import { BookService } from './book.service';
import{
  Pagination,
} from 'nestjs-typeorm-paginate';

@Controller('books')
export class BookController {
  constructor(private readonly BookService: BookService) {}


@Get()
index(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1, 
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number=10,): Promise<Pagination<Book>>{

  limit = limit > 100 ? 100 : limit;

  return this.BookService.paginate({page, limit, route: 'http://localhost:4000/books' });
}


  @Get('/searchBook/:bookTitle')
  async getBookByTitle(@Param('bookTitle') bookTitle: string) {
    //non dovrebbe servire
    if(bookTitle == " ")
     return this.BookService.searchBook(bookTitle);

    else if (bookTitle.length < 2)
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