import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../User/user.service';
import { User } from '../User/User';
import { Book } from '../Book/Book';
import { Bookclub } from './Bookclub';
import { BookclubController } from '../Bookclub/bookclub.controller';
import { BookclubService } from '../Bookclub/bookclub.service';
import { Bookclub_membership } from '../Membership/Bookclub_membership';
import { MembershipService } from '../Membership/membership.service';
import { ReadSession } from '../ReadSession/ReadSession';
import { PDL } from '../PDL/PDL';
import { PdlService } from '../PDL/PDL.service';
import { ReadSessionService } from '../ReadSession/ReadSession.service';
import { ODL } from '../ODL/ODL';
import { OdlService } from '../ODL/odl.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookclub]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([Bookclub_membership]),
    TypeOrmModule.forFeature([ReadSession]),
    TypeOrmModule.forFeature([ODL]),
    TypeOrmModule.forFeature([PDL]),
  ],
  controllers: [BookclubController],
  providers: [
    BookclubService,
    UserService,
    MembershipService,
    OdlService,
    ReadSessionService,
    PdlService,
  ],
})
export class BookclubModule {}
