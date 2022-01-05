import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { Repository } from 'typeorm';

@Injectable()
export class MembershipService {

    constructor(@InjectRepository(Bookclub_membership) private readonly MembershipRepository : Repository<Bookclub_membership>) {}

    async findMember(bookclub: number,user : string){
        return await this.MembershipRepository.find({bookclub,user});
    }

    async addMember(bookclubId : number, user : string){
        const memberShip = this.MembershipRepository.create({
            bookclub : bookclubId,
            user : user
        });
        await this.MembershipRepository.save(memberShip);
    }
}
