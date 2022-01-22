import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PDL } from '../PDL/PDL';
import { ReadSession } from './ReadSession';
import { ReadSessionService } from './ReadSession.service';

@Module({
  imports : [
    TypeOrmModule.forFeature([ReadSession]),
    TypeOrmModule.forFeature([PDL])
  ],
  providers: [ReadSessionService]
})
export class ReadSessionModule {}