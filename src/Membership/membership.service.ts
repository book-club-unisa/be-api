import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookclub } from '../Bookclub/Bookclub';
import { Bookclub_membership } from './Bookclub_membership';
import { ReadSession } from '../ReadSession/ReadSession';
import { ReadSessionService } from '../ReadSession/ReadSession.service';
import { Repository } from 'typeorm';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Bookclub_membership)
    private readonly MembershipRepository: Repository<Bookclub_membership>,
  ) {}
  @InjectRepository(ReadSession) private readonly ReadSessionRepository : Repository<ReadSession>
  @InjectRepository(Bookclub) private readonly BookclubRepository : Repository<Bookclub>
  @Inject(ReadSessionService) private readonly ReadSessionService : ReadSessionService

  async findMember(bookclub: number, user: string) {
    const member =  await this.MembershipRepository.findOne({bookclub, user});
    return member;
  }

  async addMember(bookclubId: number, user: string) {
    const bookclub = bookclubId;
    const id = bookclubId;
    const tmp = await this.BookclubRepository.findOne({id});
    if(!tmp) throw new NotFoundException();
    const book = tmp.book;
    const State = 'ACTIVE';
    const check = await this.MembershipRepository.findOne({bookclub,user})
    if(check) throw new HttpException('USER ALREADY A MEMBER', HttpStatus.BAD_REQUEST);
    const memberShip = this.MembershipRepository.create({
      bookclub: bookclubId,
      user: user,
      State : 'NOT COMPLETED',
      pageReached : 0
    });

    const readSession = await this.ReadSessionRepository.findOne({user,book,State});
    if(!readSession){
      const newSession = this.ReadSessionRepository.create({
        book : book,
        user : user,
        State : 'ACTIVE'
      });
      await this.ReadSessionRepository.save(newSession);
    }else{
      const pageReached = await this.ReadSessionService.getPages(readSession.id);
      memberShip.pageReached = pageReached;
    }

    return await this.MembershipRepository.save(memberShip);
  }
}
