import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/Entities/Book';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { Bookclub_user_invite } from 'src/Entities/Bookclub_user_invite';
import { Member } from 'src/entities/Member';
import { ReadGoal } from 'src/entities/ReadGoal';
import { User } from 'src/Entities/User';
import { MembershipService } from 'src/Membership/membership.service';
import { OdlService } from 'src/ODL/odl.service';
import { PdlService } from 'src/PDL/PDL.service';
import { Repository } from 'typeorm';
import { BookclubInfo } from './BookclubInfo';

@Injectable()
export class BookclubService {
  constructor(
    @InjectRepository(Bookclub)
    private readonly BookclubRepository: Repository<Bookclub>,
  ) {}
  @Inject(MembershipService) private readonly MembershipService: MembershipService;
  @InjectRepository(Book) private readonly BookRepository : Repository<Book>
  @InjectRepository(User) private readonly UserRepository : Repository<User>
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

  async findBookclubId(bookclubName : string, founder : string){
    const Bookclub = await this.BookclubRepository.findOne({bookclubName,founder});
    if(!Bookclub) throw new NotFoundException('Bookclub not found');
    return Bookclub.id;
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

  async findBookclubsInfo(user : string){
    const Members = await this.MembershipRepository.find({user});
    let BookclubInfos : BookclubInfo[] = [];
    for(var i =0; i<Members.length; i++){
      const Member =  Members[i];
      const id = Member.bookclub;
      const x : BookclubInfo = await this.enterBookclub(id);
      BookclubInfos.push(x);
    }     
    
    return BookclubInfos
  }

  async enterBookclub(bookclub : number) : Promise <BookclubInfo>
  {
    const Bookclub = await this.BookclubRepository.findOne(bookclub);
    const book = await this.BookRepository.findOne(Bookclub.book);
    const Members = await this.MembershipRepository.find({bookclub});
    let Membri : Member[] = [];
    Members.forEach(async(Member) =>{
      const user = await this.UserRepository.findOne(Member.user);
      const x : Member ={
        membershipId : Member.membershipId,
        user : new User(user),
        pageReached : Member.pageReached
      }
      Membri.push(x);
    })

    const lastReadGoal : ReadGoal = {
      readGoalId : -1,
      pagesCount : 0
    }
    const lastODL = await this.ODLService.getLastODL(bookclub);
    if(lastODL){
      lastReadGoal.readGoalId = lastODL.id,
      lastReadGoal.pagesCount = lastODL.pages
    }

    const secondLastReadGoal : ReadGoal = {
      readGoalId : -1,
      pagesCount : 0
    }
    if(lastODL){
      const secondLastODL = await this.ODLService.getSecondLastODL(bookclub,lastODL.pages);
      if(secondLastODL){
      secondLastReadGoal.readGoalId = secondLastODL.id,
      secondLastReadGoal.pagesCount = secondLastODL.pages
      }
    }
    


    const BookclubInfo : BookclubInfo = {
      id : bookclub,
      name : Bookclub.bookclubName,
      founderEmail : Bookclub.founder,
      Book : book,
      Members : Membri,
      lastReadGoal : lastReadGoal,
      secondLastReadGoal : secondLastReadGoal
    }

    return BookclubInfo
  }
}
