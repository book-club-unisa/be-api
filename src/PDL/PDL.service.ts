import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/Entities/Book';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { PDL } from 'src/Entities/PDL';
import { ReadSession } from 'src/Entities/ReadSession';
import { ReadSessionService } from 'src/ReadSession/ReadSession.service';
import { Repository } from 'typeorm';

@Injectable()
export class PdlService {

    @InjectRepository(PDL) private readonly PDLRepository : Repository<PDL>
    @InjectRepository(Bookclub) private readonly BookclubRepository : Repository<Bookclub>
    @InjectRepository(Book) private readonly BookRepository : Repository<Book>
    @InjectRepository(ReadSession) private readonly ReadSessionRepository : Repository<ReadSession>
    @Inject(ReadSessionService) private readonly ReadSessionService : ReadSessionService
    @InjectRepository(Bookclub_membership) private readonly MembershipRepository : Repository<Bookclub_membership>
 

    async addPDL(newPDL : number, user : string, id : number){
        const tmp = await this.BookclubRepository.findOne({id});
        if(!tmp) throw new HttpException('INVALID BOOKCLUB',HttpStatus.BAD_REQUEST);
        const bookIsbn  = tmp.book;
        const book = tmp.book;
        const booktmp = await this.BookRepository.findOne(bookIsbn);
        const bookPages : number = booktmp.pagesCount;

        
        const State = 'ACTIVE';
        const activeSession = await this.ReadSessionRepository.findOne({user,book,State});
        if(!activeSession) throw new HttpException('',HttpStatus.BAD_REQUEST);
        const sessionId = activeSession.id;
        const oldPDLs : number = await this.ReadSessionService.getPages(sessionId);

        if(newPDL + oldPDLs>bookPages){
            newPDL = bookPages - oldPDLs;
            const PDL = this.PDLRepository.create({
                pages : newPDL,
                session : activeSession.id,
                createDate : new Date().toISOString()
            });

            const BCs = await this.BookclubRepository.find({book});
            BCs.forEach(async (BC) => {
                const bookclub = BC.id;
                const member = await this.MembershipRepository.findOne({bookclub,user});
                if(member){
                    member.State = 'COMPLETED';

                    await this.MembershipRepository.save(member);
                }
            })

            activeSession.State = 'INACTIVE';
            await this.ReadSessionRepository.save(activeSession);
            return await this.PDLRepository.save(PDL);
        }

        const PDL = this.PDLRepository.create({
            pages : newPDL,
            session : activeSession.id,
            createDate : new Date().toISOString()
        });
        return await this.PDLRepository.save(PDL);
    }

    async getPercentage(user : string, bookclub : number) : Promise<number>{
        const member = await this.MembershipRepository.findOne({user,bookclub});
        if(member.State == 'COMPLETED') return 100;
        else{
            const State = 'ACTIVE';
            const Bookclub = await this.BookclubRepository.findOne(bookclub);
            const book = Bookclub.book;
            const Book = await this.BookRepository.findOne(book);
            const activeSession = await this.ReadSessionRepository.findOne({user,book,State});
            const readPages = await this.ReadSessionService.getPages(activeSession.id);
            const percentage = (readPages*100)/Book.pagesCount;
            return percentage;
        }
    }


    async getReadSessions(user : string){
        const sessions = await this.ReadSessionRepository.find({user});
        return sessions;
    }

    async getPDLs(id : number, user : string){
        const session = await this.ReadSessionRepository.find({id,user});
        if(!session) throw new HttpException('', HttpStatus.UNAUTHORIZED);
        return await this.PDLRepository.find({id})
    }
}
