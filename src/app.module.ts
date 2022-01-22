import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './User/User';
import { Book } from './Book/Book';
import { BookController } from './Book/book.controller';
import { UserController } from './User/user.controller';
import { UserService } from './User/user.service';
import { BookService } from './Book/book.service';
import { Repository } from 'typeorm';
import { Bookclub } from './Bookclub/Bookclub';
import { BookclubController } from './Bookclub/bookclub.controller';
import { BookclubService } from './Bookclub/bookclub.service';
import { Bookclub_user_invite } from './Invite/Bookclub_user_invite';
import { InviteController } from './Invite/invite.controller';
import { InviteService } from './Invite/invite.service';
import { Bookclub_membership } from './Membership/Bookclub_membership';
import { MembershipService } from './Membership/membership.service';
import { ReadSession } from './ReadSession/ReadSession';
import { PDL } from './PDL/PDL';
import { PdlController } from './PDL/PDL.controller';
import { PdlService } from './PDL/PDL.service';
import { ReadSessionService } from './ReadSession/ReadSession.service';
import { ODL } from './ODL/ODL';
import { OdlController } from './ODL/odl.controller';
import { OdlService } from './ODL/odl.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'books',
      entities: [
        Bookclub,
        User,
        Book,
        Bookclub_user_invite,
        Bookclub_membership,
        ReadSession,
        PDL,
        ODL
      ],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Bookclub]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([Bookclub_user_invite]),
    TypeOrmModule.forFeature([Bookclub_membership]),
    TypeOrmModule.forFeature([ReadSession]),
    TypeOrmModule.forFeature([PDL]),
    TypeOrmModule.forFeature([ODL]),
  ],
  controllers: [
    UserController,
    BookController,
    BookclubController,
    InviteController,
    PdlController,
    OdlController
  ],
  providers: [
    UserService,
    Repository,
    BookService,
    BookclubService,
    InviteService,
    MembershipService,
    PdlService,
    ReadSessionService,
    OdlService
  ],
})
export class AppModule {}
