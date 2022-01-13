import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookclubService } from 'src/Bookclub/bookclub.service';
import { Book } from 'src/Entities/Book';
import { Bookclub } from 'src/Entities/Bookclub';
import { Bookclub_user_invite } from 'src/Entities/Bookclub_user_invite';
import { MembershipService } from 'src/Membership/membership.service';
import { UserService } from 'src/User/user.service';
import { Repository } from 'typeorm';
import { InvitoResponse } from './InvitoResponse';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Bookclub_user_invite)
    private readonly InviteRepository: Repository<Bookclub_user_invite>,
  ) {}
  @Inject(UserService) private readonly UserService: UserService;
  @Inject(BookclubService) private readonly BookclubService: BookclubService;
  @Inject(MembershipService) private readonly MembershipService: MembershipService;
  @InjectRepository(Bookclub) private readonly BookclubRepository : Repository<Bookclub>
  @InjectRepository(Book) private readonly BookRepository : Repository<Book>


  async inviteUser(user: string, bookclub: number) {
    await this.UserService.findUserByEmail(user);
    const check = await this.MembershipService.findMember(bookclub, user);
    const check2 = await this.InviteRepository.find({ bookclub, user });
    if (check.length)
      throw new HttpException(
        'CANNOT INVITE A MEMBER OF YOUR OWN BOOKCLUB',
        HttpStatus.FORBIDDEN,
      );
    else if (check2.length)
      throw new HttpException(
        'CANNOT INVITE A USER THAT HAS NOT REPLIED YET',
        HttpStatus.BAD_REQUEST,
      );
    else {
      const newInvite = this.InviteRepository.create({
        bookclub: bookclub,
        user: user,
        State: 'PENDING',
      });
      return this.InviteRepository.save(newInvite);
    }
  }


  async getInvites(user : string) : Promise<InvitoResponse[]>{
    const invites = await this.InviteRepository.find({user});
    console.log(invites);
    const Inviti: InvitoResponse[] = [];
    let Bookclub : Bookclub;
    let Book : Book;
    let Invite : InvitoResponse;
    let URL : string;
    let bookclubName : string;

    for(var i = 0; i<invites.length; i++){
      const invite =  invites[i];

      Bookclub = await this.BookclubRepository.findOne(invite.bookclub);
      bookclubName = Bookclub.bookclubName;
      Book = await this.BookRepository.findOne(Bookclub.book);
      URL = Book.coverUrl;

      Invite = {
        invitoUtente : invite,
        nomeBookclub : bookclubName,
        coverLibro : URL
      }
      Inviti.push(Invite);
    }

    return Inviti;
  }

  async seeInvites(bookclub : number){
    return await this.InviteRepository.find({bookclub});
  }

  async acceptInvite(inviteId: number, user: string) {
    const invite = await this.InviteRepository.findOne({ inviteId, user });
    if (!invite) throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    else if (invite && invite.State == 'PENDING') {
      invite.State = 'ACCEPTED';
      const bookclubId = invite.bookclub;
      await this.MembershipService.addMember(bookclubId, user);
      return await this.InviteRepository.save(invite);
    } else if (invite.State != 'PENDING')
      throw new HttpException(
        'INVITE ALREADY ACCEPTED',
        HttpStatus.UNAUTHORIZED,
      );
  }

  async refuseInvite(inviteId: number, user: string) {
    const invite = await this.InviteRepository.findOne({ inviteId, user });
    if (invite && invite.State == 'PENDING') {
      invite.State = 'REFUSED';
      return await this.InviteRepository.save(invite);
    } else if (invite.State != 'PENDING')
      throw new HttpException('NOT AUTHORIZED', HttpStatus.UNAUTHORIZED);
    else throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
  }

  async deleteInvite(user: string, bookclub: number) {
    const check = await this.InviteRepository.findOne({ user, bookclub });
    if (check && check.State == 'PENDING')
      return this.InviteRepository.delete(check);
    else
      throw new HttpException(
        'CANNOT DELETE A NON-PENDING INVITE',
        HttpStatus.UNAUTHORIZED,
      );
  }
}
