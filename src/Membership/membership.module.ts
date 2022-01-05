import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

@Module({
  imports : [
    TypeOrmModule.forFeature([Bookclub_membership])
  ],
  controllers: [MembershipController],
  providers: [MembershipService]
})
export class MembershipModule {}
