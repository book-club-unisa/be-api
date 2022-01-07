import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PDL } from 'src/Entities/PDL';
import { ReadSession } from 'src/Entities/ReadSession';
import { Repository } from 'typeorm';

@Injectable()
export class ReadSessionService {

    @InjectRepository(ReadSession) private readonly ReadSessionRepository : Repository<ReadSession>
    @InjectRepository(PDL) private readonly PDLRepository : Repository<PDL>

    async getPages(id : number){
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
