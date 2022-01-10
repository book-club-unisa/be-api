import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookclubModule } from 'src/Bookclub/bookclub.module';
import { BookclubService } from 'src/Bookclub/bookclub.service';
import { Book } from 'src/Entities/Book';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { Bookclub_user_invite } from 'src/Entities/Bookclub_user_invite';
import { ODL } from 'src/Entities/ODL';
import { PDL } from 'src/Entities/PDL';
import { ReadSession } from 'src/Entities/ReadSession';
import { User } from 'src/Entities/User';
import { MembershipModule } from 'src/Membership/membership.module';
import { MembershipService } from 'src/Membership/membership.service';
import { OdlService } from 'src/ODL/odl.service';
import { PdlService } from 'src/PDL/PDL.service';
import { ReadSessionService } from 'src/ReadSession/ReadSession.service';
import { UserService } from 'src/User/user.service';
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
  providers: [InviteService, UserService, BookclubService, MembershipService, OdlService, ReadSessionService, PdlService],
})
export class InviteModule {}
