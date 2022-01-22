import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../Book/Book';
import { Bookclub } from '../Bookclub/Bookclub';
import { Bookclub_membership } from '../Membership/Bookclub_membership';
import { PDL } from './PDL';
import { ReadSession } from '../ReadSession/ReadSession';
import { User } from '../User/User';
import { MembershipService } from '../Membership/membership.service';
import { ReadSessionService } from '../ReadSession/ReadSession.service';
import { UserService } from '../User/user.service';
import { PdlController } from './PDL.controller';
import { PdlService } from './PDL.service';

@Module({
  imports : [
    TypeOrmModule.forFeature([PDL]),
    TypeOrmModule.forFeature([Bookclub]),
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([ReadSession]),
    TypeOrmModule.forFeature([Bookclub_membership]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [PdlController],
  providers: [PdlService,ReadSessionService,UserService,MembershipService]
})
export class PdlModule {}
