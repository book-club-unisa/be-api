import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookclubService } from 'src/Bookclub/bookclub.service';
import { Book } from 'src/Entities/Book';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { ODL } from 'src/Entities/ODL';
import { PDL } from 'src/Entities/PDL';
import { ReadSession } from 'src/Entities/ReadSession';
import { User } from 'src/Entities/User';
import { MembershipService } from 'src/Membership/membership.service';
import { PdlService } from 'src/PDL/PDL.service';
import { ReadSessionService } from 'src/ReadSession/ReadSession.service';
import { UserService } from 'src/User/user.service';
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
