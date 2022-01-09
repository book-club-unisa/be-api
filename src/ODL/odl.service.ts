import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/Entities/Book';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { ODL } from 'src/Entities/ODL';
import { ReadSession } from 'src/Entities/ReadSession';
import { ReadSessionService } from 'src/ReadSession/ReadSession.service';
import { Repository } from 'typeorm';

@Injectable()
export class OdlService {

    @InjectRepository(Bookclub) BookclubRepository : Repository<Bookclub>
    @InjectRepository(ODL) ODLRepository : Repository<ODL>
    @InjectRepository(Bookclub_membership) MembershipRepository : Repository<Bookclub_membership>
    @InjectRepository(Book) BookRepository : Repository<Book>
    @Inject(ReadSessionService) ReadSessionService : ReadSessionService
    @InjectRepository(ReadSession) ReadSessionRepository : Repository<ReadSession>

    async getLastODL(bookclub : number) : Promise<ODL>{
        const lastODLs = await this.ODLRepository.find({bookclub});
        let lastODL: ODL;
        let  milestone = 0;
        if(!lastODLs.length) return undefined;
        lastODLs.forEach((ODL) =>{
            if(ODL.pages > milestone){
                milestone = ODL.pages;
                lastODL = ODL;
            }
        })
        return lastODL;
    }

    async updateLastReadGoal(bookclub : number,milestone : number){
        const tmp = await this.BookclubRepository.findOne(bookclub);
        const tmp2 = await this.BookRepository.findOne(tmp.book);
        const maxPages = tmp2.pagesCount;
        const book = tmp2.isbn;
 
        if(milestone>maxPages) throw new HttpException('',HttpStatus.BAD_REQUEST);
        const lastODL = await this.getLastODL(bookclub);
        if(!lastODL){
            const newODL = this.ODLRepository.create({
                bookclub : bookclub,
                pages : milestone,
            })
            return await this.ODLRepository.save(newODL);
        }

        const members = await this.MembershipRepository.find({bookclub});
        members.forEach(async (member) =>{
            if(member.State == 'NOT COMPLETED'){
                const State = 'ACTIVE';
                const user = member.user;
                const sessionId = await this.ReadSessionRepository.findOne({user,book,State});
                const PDL = await this.ReadSessionService.getPages(sessionId.id);
                if(PDL < lastODL.pages){
                    lastODL.pages = milestone;
                    return this.ODLRepository.save(lastODL);
                }
            }
        })

        const newODL = this.ODLRepository.create({
            bookclub : bookclub,
            pages : milestone,
        })
        return await this.ODLRepository.save(newODL);
    }
}
