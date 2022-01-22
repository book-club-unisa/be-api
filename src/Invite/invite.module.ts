import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookclubModule } from '../Bookclub/bookclub.module';
import { BookclubService } from '../Bookclub/bookclub.service';
import { Book } from '../Book/Book';
import { Bookclub } from '../Bookclub/Bookclub';
import { Bookclub_membership } from '../Membership/Bookclub_membership';
import { Bookclub_user_invite } from './Bookclub_user_invite';
import { ODL } from '../ODL/ODL';
import { PDL } from '../PDL/PDL';
import { ReadSession } from '../ReadSession/ReadSession';
import { User } from '../User/User';
import { MembershipModule } from '../Membership/membership.module';
import { MembershipService } from '../Membership/membership.service';
import { OdlService } from '../ODL/odl.service';
import { PdlService } from '../PDL/PDL.service';
import { ReadSessionService } from '../ReadSession/ReadSession.service';
import { UserService } from '../User/user.service';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookclub_user_invite]),
    TypeOrmModule.forFeature([Bookclub]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Bookclub_membership]),
    TypeOrmModule.forFeature([ReadSession]),
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([ODL]),
    TypeOrmModule.forFeature([PDL]),
    BookclubModule,
    MembershipModule,
  ],
  controllers: [InviteController],
  providers: [
    InviteService,
    UserService,
    BookclubService,
    MembershipService,
    OdlService,
    ReadSessionService,
    PdlService,
  ],
})
export class InviteModule {}
