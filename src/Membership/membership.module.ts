import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { PDL } from 'src/Entities/PDL';
import { ReadSession } from 'src/Entities/ReadSession';
import { ReadSessionService } from 'src/ReadSession/ReadSession.service';
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
