import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/Entities/Book';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { ReadSession } from 'src/Entities/ReadSession';
import { Repository } from 'typeorm';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Bookclub_membership)
    private readonly MembershipRepository: Repository<Bookclub_membership>,
  ) {}
  @InjectRepository(ReadSession) private readonly ReadSessionRepository : Repository<ReadSession>
  @InjectRepository(Bookclub) private readonly BookclubRepository : Repository<Bookclub>

  async findMember(bookclub: number, user: string) {
    const member =  await this.MembershipRepository.find({ bookclub, user });
    if(!member.length) throw new HttpException('',HttpStatus.UNAUTHORIZED);
    return member
  }

  async addMember(bookclubId: number, user: string) {
    const memberShip = this.MembershipRepository.create({
      bookclub: bookclubId,
      user: user,
      State : 'NOT COMPLETED',
      pageReached : 0
    });

    const id = bookclubId;
    const bookclub = await this.BookclubRepository.findOne({id});
    const book = bookclub.book;
    const State = 'ACTIVE';
    const readSession = await this.ReadSessionRepository.findOne({user,book,State});
    if(!readSession){
      const newSession = this.ReadSessionRepository.create({
        book : book,
        user : user,
        State : 'ACTIVE'
      });
      await this.ReadSessionRepository.save(newSession);
    }

    await this.MembershipRepository.save(memberShip);
  }
}
