import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/Book';
import { Bookclub } from 'src/entities/Bookclub';
import { User } from 'src/entities/User';
import { UserService } from 'src/User/user.service';
import { BookclubController } from './bookclub.controller';
import { BookclubService } from './bookclub.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookclub]),
    TypeOrmModule.forFeature([User]),  
    TypeOrmModule.forFeature([Book])
  ],
  controllers: [BookclubController],
  providers: [BookclubService, UserService]
})
export class BookclubModule {}
