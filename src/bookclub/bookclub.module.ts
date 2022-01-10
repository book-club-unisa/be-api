import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/Entities/Book';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { ODL } from 'src/Entities/ODL';
import { PDL } from 'src/Entities/PDL';
import { ReadSession } from 'src/Entities/ReadSession';
import { User } from 'src/Entities/User';
import { MembershipService } from 'src/Membership/membership.service';
import { OdlService } from 'src/ODL/odl.service';
import { PdlService } from 'src/PDL/PDL.service';
import { ReadSessionService } from 'src/ReadSession/ReadSession.service';
import { UserService } from 'src/User/user.service';
import { BookclubController } from './bookclub.controller';
import { BookclubService } from './bookclub.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookclub]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([Bookclub_membership]),
    TypeOrmModule.forFeature([ReadSession]),
    TypeOrmModule.forFeature([ODL]),
    TypeOrmModule.forFeature([PDL])
  ],
  controllers: [BookclubController],
  providers: [BookclubService, UserService, MembershipService, OdlService, ReadSessionService, PdlService],
})
export class BookclubModule {}
