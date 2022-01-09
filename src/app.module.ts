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
import { ReadSessionModule } from './ReadSession/ReadSession.module';
import { ReadSession } from './Entities/ReadSession';
import { PdlModule } from './PDL/PDL.module';
import { PDL } from './Entities/PDL';
import { PdlController } from './PDL/PDL.controller';
import { PdlService } from './PDL/PDL.service';
import { ReadSessionService } from './ReadSession/ReadSession.service';
import { OdlModule } from './ODL/odl.module';
import { ODL } from './Entities/ODL';
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
      database: 'BC',
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
    BookclubModule,
    InviteModule,
    MembershipModule,
    ReadSessionModule,
    PdlModule,
    OdlModule,
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
