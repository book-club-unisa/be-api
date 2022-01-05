import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/Entities/Book';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { User } from 'src/Entities/User';
import { MembershipService } from 'src/Membership/membership.service';
import { UserService } from 'src/User/user.service';
import { BookclubController } from './bookclub.controller';
import { BookclubService } from './bookclub.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookclub]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([Bookclub_membership])
  ],
  controllers: [BookclubController],
  providers: [BookclubService, UserService, MembershipService],
})
export class BookclubModule {}
