import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookclubModule } from 'src/Bookclub/bookclub.module';
import { BookclubService } from 'src/Bookclub/bookclub.service';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { Bookclub_user_invite } from 'src/Entities/Bookclub_user_invite';
import { ReadSession } from 'src/Entities/ReadSession';
import { User } from 'src/Entities/User';
import { MembershipModule } from 'src/Membership/membership.module';
import { MembershipService } from 'src/Membership/membership.service';
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
    BookclubModule,
    MembershipModule,
  ],
  controllers: [InviteController],
  providers: [InviteService, UserService, BookclubService, MembershipService],
})
export class InviteModule {}
