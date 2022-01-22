import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PDL } from '../PDL/PDL';
import { ReadSession } from './ReadSession';
import { Repository } from 'typeorm';

@Injectable()
export class ReadSessionService {

    @InjectRepository(ReadSession) private readonly ReadSessionRepository : Repository<ReadSession>
    @InjectRepository(PDL) private readonly PDLRepository : Repository<PDL>

    async getActiveSession(user : string) : Promise<number>{
        const State = 'ACTIVE'
        const activeSession = await this.ReadSessionRepository.findOne({user,State});
        if(!activeSession) return -1;
        return activeSession.id;
    }
    
    async getPages(id : number) : Promise<number>{
        let pages = 0;
        const readSession = await this.ReadSessionRepository.findOne({id});
        if(!readSession) return pages;
        const session = id;
        const oldPDLs = await this.PDLRepository.find({session});
        if(!oldPDLs.length) return 0;
        else{
            oldPDLs.forEach((PDL) =>{
                const pagesRead = PDL.pages;
                pages += pagesRead;
            })
        }
        return pages;
    }
}
