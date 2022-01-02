import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entities/User';
import { Book } from './Entities/Book';
import { BookController } from './Book/book.controller';
import { UserController } from './User/user.controller';
import { UserService } from './User/user.service';
import { BookService } from './Book/book.service';
import { Repository } from 'typeorm';


@Module({
  imports : [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'BC',
    entities: [User, Book],
    synchronize: false,
  }),TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Book])],
  controllers: [UserController,BookController],
  providers: [UserService,Repository,BookService],
})
export class AppModule {}
