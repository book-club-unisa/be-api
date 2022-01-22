import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../Book/Book';
import { Bookclub } from '../Bookclub/Bookclub';
import { Bookclub_membership } from '../Membership/Bookclub_membership';
import { ODL } from './ODL';
import { ReadSession } from '../ReadSession/ReadSession';
import { ReadSessionService } from '../ReadSession/ReadSession.service';
import { Repository } from 'typeorm';

@Injectable()
export class OdlService {

    @InjectRepository(Bookclub) BookclubRepository: Repository<Bookclub>
    @InjectRepository(ODL) ODLRepository: Repository<ODL>
    @InjectRepository(Bookclub_membership) MembershipRepository: Repository<Bookclub_membership>
    @InjectRepository(Book) BookRepository: Repository<Book>
    @Inject(ReadSessionService) ReadSessionService: ReadSessionService
    @InjectRepository(ReadSession) ReadSessionRepository: Repository<ReadSession>

    async getLastODL(bookclub: number): Promise<ODL> {
        const lastODLs = await this.ODLRepository.find({ bookclub });
        let lastODL: ODL;
        let milestone = 0;
        if (!lastODLs.length) return undefined;
        lastODLs.forEach((ODL) => {
            if (ODL.pages > milestone) {
                milestone = ODL.pages;
                lastODL = ODL;
            }
        })
        return lastODL;
    }


    async getSecondLastODL(bookclub: number, milestone: number) {
        const lastODLs = await this.ODLRepository.find({ bookclub });
        let lastODL: ODL;
        let x = 0;
        if (lastODLs.length < 2) return undefined;
        lastODLs.forEach((ODL) => {
            if (ODL.pages > x && ODL.pages != milestone) {
                x = ODL.pages;
                lastODL = ODL;
            }
        })
        return lastODL;
    }

    async checkODLStatus(bookclub: number): Promise<Bookclub_membership[]> {
        const Bookclub = await this.BookclubRepository.findOne(bookclub);
        const book = Bookclub.book;
        const Members = await this.MembershipRepository.find({ bookclub });
        const lastODL = await this.getLastODL(bookclub);
        if (!lastODL) return Members;
        const State = 'ACTIVE';
        const readyMembers: Bookclub_membership[] = [];
        for (var i = 0; i < Members.length; i++) {
            const Member = Members[i];
            if (Member.State != 'COMPLETED') {
                const user = Member.user;
                const activeSession = await this.ReadSessionRepository.findOne({ user, book, State });
                const pages = await this.ReadSessionService.getPages(activeSession.id);
                if (pages > lastODL.pages) {
                    readyMembers.push(Member);
                }
            } else readyMembers.push(Member);
        }
        return readyMembers;
    }

    async createODL(bookclub: number, milestone: number) {
        const tmp = await this.BookclubRepository.findOne(bookclub);
        const tmp2 = await this.BookRepository.findOne(tmp.book);
        const lastODL = await this.getLastODL(bookclub);
        if (!lastODL) {
            const newODL = this.ODLRepository.create({
                bookclub: bookclub,
                pages: milestone,
            })
            return await this.ODLRepository.save(newODL);
        }
        const maxPages = tmp2.pagesCount;
        if (milestone > maxPages || milestone <= lastODL.pages) throw new HttpException('', HttpStatus.BAD_REQUEST);
        const newODL = this.ODLRepository.create({
            bookclub: bookclub,
            pages: milestone,
        })
        return await this.ODLRepository.save(newODL);
    }

    async updateODL(bookclub: number, milestone: number) {
        const tmp = await this.BookclubRepository.findOne(bookclub);
        const tmp2 = await this.BookRepository.findOne(tmp.book);
        const lastODL = await this.getLastODL(bookclub);
        const maxPages = tmp2.pagesCount;
        if (milestone > maxPages || milestone <= lastODL.pages) throw new HttpException('', HttpStatus.BAD_REQUEST);
        else {
            lastODL.pages = milestone;
            return await this.ODLRepository.save(lastODL);
        }
    }

    async checkStatus(bookclub: number) {
        const tmp = await this.BookclubRepository.findOne(bookclub);
        if(!tmp) throw new NotFoundException();
        const members = await this.MembershipRepository.find({ bookclub })
        const lastODL = await this.getLastODL(bookclub);
        let x = 0;
        if (!lastODL) return 'CREATE';
        for (var i = 0; i < members.length; i++) {
            const member = members[i];
            if (member.pageReached < lastODL.pages) {
                x = 1;
                return 'UPDATE';
            }
        }
        if (x == 0) return 'CREATE';
    }
}
