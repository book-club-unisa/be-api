import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookclub } from 'src/Entities/Bookclub';
import { MembershipService } from 'src/Membership/membership.service';
import { Repository } from 'typeorm';

@Injectable()
export class BookclubService {
  constructor(
    @InjectRepository(Bookclub)
    private readonly BookclubRepository: Repository<Bookclub>,
  ) {}
    @Inject(MembershipService) private readonly MembershipService : MembershipService

  async createBookclub(isbn: string, bookclubName: string, founder: string) {
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

  async addFounder(bookclubId : number , founder : string){
    this.MembershipService.addMember(bookclubId,founder);
  }

  async validateFounder(founder : string, id : number) : Promise<String>{
    const check = await this.BookclubRepository.findOne({founder, id});
    if(check) return 'FOUND';
    else throw new HttpException('NOT AUTHORIZED',HttpStatus.UNAUTHORIZED)
  }

  async findBookclub(id : number){
    const check = await this.BookclubRepository.findOne(id);
    if(!check) throw new HttpException('BOOKCLUB NOT FOUND', HttpStatus.NOT_FOUND);
    else return check;
  }

  async deleteBookclub(bookclubName: string, founder : string) {
    const check = await this.BookclubRepository.find({founder, bookclubName });
    if (!check.length) throw new HttpException('BOOKCLUB NOT FOUND', HttpStatus.NOT_FOUND);
    else {
      const found = check.find((bc) => (bc.bookclubName = bookclubName));
      if (found) {
        this.BookclubRepository.delete(found);
        return 'BOOKCLUB DELETED';
      } else
        throw new HttpException('BOOKCLUB NOT FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
