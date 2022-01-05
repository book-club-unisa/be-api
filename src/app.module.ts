import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entities/User';
import { Book } from './Entities/Book';
import { BookController } from './Book/book.controller';
import { UserController } from './User/user.controller';
import { UserService } from './User/user.service';
import { BookService } from './Book/book.service';
import { Repository } from 'typeorm';
import { BookclubModule } from './Bookclub/bookclub.module';
import { Bookclub } from './Entities/Bookclub';
import { BookclubController } from './Bookclub/bookclub.controller';
import { BookclubService } from './Bookclub/bookclub.service';
import { Bookclub_user_invite } from './Entities/Bookclub_user_invite';
import { InviteModule } from './Invite/invite.module';
import { InviteController } from './Invite/invite.controller';
import { InviteService } from './Invite/invite.service';
import { MembershipModule } from './Membership/membership.module';
import { Bookclub_membership } from './Entities/Bookclub_membership';
import { MembershipService } from './Membership/membership.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'BC',
      entities: [Bookclub, User, Book, Bookclub_user_invite, Bookclub_membership],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Bookclub]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([Bookclub_user_invite]),
    TypeOrmModule.forFeature([Bookclub_membership]),
    BookclubModule,
    InviteModule,
    MembershipModule,
  ],
  controllers: [UserController, BookController, BookclubController,InviteController],
  providers: [UserService, Repository, BookService, BookclubService,InviteService,MembershipService],
})
export class AppModule {}