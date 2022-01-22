import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookclubService } from '../Bookclub/bookclub.service';
import { Book } from '../Book/Book';
import { Bookclub } from '../Bookclub/Bookclub';
import { Bookclub_membership } from '../Membership/Bookclub_membership';
import { ODL } from './ODL';
import { PDL } from '../PDL/PDL';
import { ReadSession } from '../ReadSession/ReadSession';
import { User } from '../User/User';
import { MembershipService } from '../Membership/membership.service';
import { PdlService } from '../PDL/PDL.service';
import { ReadSessionService } from '../ReadSession/ReadSession.service';
import { UserService } from '../User/user.service';
import { OdlController } from './odl.controller';
import { OdlService } from './odl.service';

@Module({

  imports : [
      TypeOrmModule.forFeature([ODL]),
      TypeOrmModule.forFeature([User]),
      TypeOrmModule.forFeature([Book]),
      TypeOrmModule.forFeature([Bookclub]),
      TypeOrmModule.forFeature([Bookclub_membership]),
      TypeOrmModule.forFeature([ReadSession]),
      TypeOrmModule.forFeature([PDL])
    ],
  controllers: [OdlController],
  providers: [OdlService,UserService,BookclubService,ReadSessionService,MembershipService, PdlService]
})
export class OdlModule {}
