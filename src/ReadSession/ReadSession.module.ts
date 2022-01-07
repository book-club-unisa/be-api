import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PDL } from 'src/Entities/PDL';
import { ReadSession } from 'src/Entities/ReadSession';
import { ReadSessionService } from './ReadSession.service';

@Module({
  imports : [
    TypeOrmModule.forFeature([ReadSession]),
    TypeOrmModule.forFeature([PDL])
  ],
  providers: [ReadSessionService]
})
export class ReadSessionModule {}
