import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookclub } from 'src/entities/Bookclub';
import { UserService } from 'src/User/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class BookclubService {

    constructor(
        @InjectRepository(Bookclub) private readonly BookclubRepository: Repository<Bookclub>,
        @Inject(UserService) private readonly UserService : UserService,
      ) {}
    
    async createBookclub(isbn: string, bookclubName: string, founder: string){
        const check =  await this.BookclubRepository.find({bookclubName,founder});
        if(check.length) throw new  HttpException('Bookclub name must be unique for each user', HttpStatus.BAD_REQUEST);
        else {
            const name = bookclubName;
            const newBC = this.BookclubRepository.create({
                bookclubName : name,
                book : isbn,
                founder: founder,
            });
            return this.BookclubRepository.save(newBC);
        }
    }

    async deleteBookclub(bookclubName,founder){
        const check = await this.BookclubRepository.find({founder,bookclubName});
        console.log(check)
        if(!check.length) throw new HttpException('BOOKCLUB NOT FOUND', HttpStatus.NOT_FOUND);
        else {
            const found = check.find((bc) => bc.bookclubName = bookclubName);
            if(found) {
                this.BookclubRepository.delete(found);
                return "BOOKCLUB DELETED";
            }
            else throw new HttpException('BOOKCLUB NOT FOUND', HttpStatus.NOT_FOUND);
        }
    }
   /**  getBookclubs(): Promise<Bookclub[]>{
        return this.bookclubRepository.find();
    }*/
}
