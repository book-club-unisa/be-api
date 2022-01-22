import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookclub } from '../Bookclub/Bookclub';
import { Bookclub_membership } from './Bookclub_membership';
import { PDL } from '../PDL/PDL';
import { ReadSession } from '../ReadSession/ReadSession';
import { ReadSessionService } from '../ReadSession/ReadSession.service';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookclub_membership]),
    TypeOrmModule.forFeature([ReadSession]),
    TypeOrmModule.forFeature([Bookclub]),
    TypeOrmModule.forFeature([PDL])
  ],
  controllers: [MembershipController],
  providers: [MembershipService,ReadSessionService],
})
export class MembershipModule {}
