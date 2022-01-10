import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/Entities/Book';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { Bookclub_user_invite } from 'src/Entities/Bookclub_user_invite';
import { MembershipService } from 'src/Membership/membership.service';
import { OdlService } from 'src/ODL/odl.service';
import { PdlService } from 'src/PDL/PDL.service';
import { Repository } from 'typeorm';
import { BoockclubInfo } from './BookclubInfo';

@Injectable()
export class BookclubService {
  constructor(
    @InjectRepository(Bookclub)
    private readonly BookclubRepository: Repository<Bookclub>,
  ) {}
  @Inject(MembershipService) private readonly MembershipService: MembershipService;
  @InjectRepository(Book) private readonly BookRepository : Repository<Book>
  @InjectRepository(Bookclub_membership) private readonly MembershipRepository : Repository<Bookclub_membership>
  @Inject(OdlService) private readonly ODLService : OdlService
  @Inject(PdlService) private readonly PDLService : PdlService

  async createBookclub(isbn: string, bookclubName: string, founder: string) {
    const book = await this.BookRepository.find({isbn});
    if(!book.length) throw new HttpException('',HttpStatus.BAD_REQUEST);
    const check = await this.BookclubRepository.find({ bookclubName, founder });
    if (check.length)
      throw new HttpException(
        'Bookclub name must be unique for each user',
        HttpStatus.BAD_REQUEST,
      );
    else {
      const name = bookclubName;
      const newBC = this.BookclubRepository.create({
        bookclubName: name,
        book: isbn,
        founder: founder,
      });
      return await this.BookclubRepository.save(newBC);
    }
  }

  async addFounder(bookclubId: number, founder: string) {
    this.MembershipService.addMember(bookclubId, founder);
  }

  async validateFounder(founder: string, id: number): Promise<string> {
    const check = await this.BookclubRepository.findOne({ founder, id });
    if (check) return 'FOUND';
    else throw new HttpException('NOT AUTHORIZED', HttpStatus.UNAUTHORIZED);
  }

  async findBookclub(id: number) {
    const check = await this.BookclubRepository.findOne(id);
    if (!check)
      throw new HttpException('BOOKCLUB NOT FOUND', HttpStatus.NOT_FOUND);
    else return check;
  }

  async findBookclubs(user : string) :Promise<Bookclub[]>{
    let Bookclubs : Bookclub[];
    const members = await this.MembershipRepository.find({user});
    if(!members.length) throw new HttpException('',HttpStatus.BAD_REQUEST);
    members.forEach(async (member) =>{
        const id = member.bookclub;
        const bookclub = await this.BookclubRepository.findOne({id});
        Bookclubs.push(bookclub);
    })
    return Bookclubs;
  }

  async deleteBookclub(id : number, founder: string) {
    const check = await this.BookclubRepository.findOne({founder,id});
    if (!check) throw new HttpException('BOOKCLUB NOT FOUND', HttpStatus.NOT_FOUND);
    this.BookclubRepository.delete(check);
    return 'BOOKCLUB DELETED';
  }

  async enterBookclub(user : string, bookclub : number) : Promise <BoockclubInfo>
  {
    const Bookclub = await this.BookclubRepository.findOne(bookclub);
    const Book = await this.BookRepository.findOne(Bookclub.book);
    const Members = await this.MembershipRepository.find({bookclub});
    const lastODL = await this.ODLService.getLastODL(bookclub);
    let ODLGoal ; Number;
    if(!lastODL) ODLGoal = 0;
    else ODLGoal = lastODL.pages;
    const readyMembers = await this.ODLService.checkODLStatus(bookclub);
    const PDLPercentage = await this.PDLService.getPercentage(user,bookclub);

    const BoockclubInfo = {
      Bookclub : Bookclub,
      Book : Book,
      Members : Members,
      ODLGoal : ODLGoal,
      ODLMembers : readyMembers,
      PDLPercentage : PDLPercentage
    }

    return BoockclubInfo;
  }
}
