import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookDto } from 'src/dtos/book.dto';
import { Book } from 'src/Entities/Book';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly BookRepository: Repository<Book>,
  ) {}

  async queryBuilder(Books: string) {
    return this.BookRepository.createQueryBuilder(Books);
  }

  async findBooksByTitle(bookTitle: string): Promise<Book[]> {
    const Books = await this.BookRepository.find();
    const booksFound: Book[] = [];
    Books.forEach((book) => {
      book.title = book.title.toUpperCase();
      const title = bookTitle.toUpperCase();
      if (book.title.includes(title)) {
        booksFound.push(book);
      }
    });
    return booksFound;
  }

  async findBookByIsbn(isbn: string): Promise<Book> {
    const book = await this.BookRepository.findOne(isbn);
    if (book) return book;
    else throw new HttpException('Invalid ISBN', HttpStatus.BAD_REQUEST);
  }

  async saveBook(bookDto: BookDto) {
    return await this.BookRepository.save(bookDto);
  }
}
