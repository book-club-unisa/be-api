import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/Entities/Book';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { PDL } from 'src/Entities/PDL';
import { ReadSession } from 'src/Entities/ReadSession';
import { User } from 'src/Entities/User';
import { MembershipService } from 'src/Membership/membership.service';
import { ReadSessionService } from 'src/ReadSession/ReadSession.service';
import { UserService } from 'src/User/user.service';
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
