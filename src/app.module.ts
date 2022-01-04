import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { Book } from './entities/Book';
import { BookController } from './Book/book.controller';
import { UserController } from './User/user.controller';
import { UserService } from './User/user.service';
import { BookService } from './Book/book.service';
import { Repository } from 'typeorm';
import { BookclubModule } from './bookclub/bookclub.module';
import { Bookclub } from './entities/Bookclub';
import { BookclubService } from './bookclub/bookclub.service';
import { BookclubController } from './bookclub/bookclub.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Pallavolo1',
      database: 'books',
      entities: [Bookclub, User, Book],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([Bookclub]),
    BookclubModule,
  ],
  controllers: [UserController, BookController, BookclubController],
  providers: [UserService, Repository, BookService, BookclubService],
})
export class AppModule {}
