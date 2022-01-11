import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BookclubService } from './bookclub.service';
import { UserService } from 'src/User/user.service';
import { AddBookclub } from './AddBookclub';
import { MembershipService } from 'src/Membership/membership.service';

@Controller('bookclubs')
export class BookclubController {
  constructor(private readonly BookclubService: BookclubService) {}
  @Inject(UserService) private readonly UserService: UserService;
  @Inject(MembershipService) private readonly MembershipService : MembershipService

  async loadPermissionsByToken(token: string | undefined): Promise<string> {
    if (!token) {
      return 'UNAUTHORIZED';
    }
    const plainData = Buffer.from(token, 'base64').toString();
    const [email, password] = plainData.split('@@@');
    if ((await this.UserService.findUser(email, password)) == 'FOUND')
      return email;
    else return 'UNAUTHORIZED';
  }


  async loadPermissionsByTokenFounder(token: string | undefined,bookclubId: number): Promise<string> {
    if (!token) {
      return 'UNAUTHORIZED';
    }
    const plainData = Buffer.from(token, 'base64').toString();
    const [email, password] = plainData.split('@@@');
    if ((await this.UserService.findUser(email, password)) == 'FOUND'){
      if((await this.BookclubService.validateFounder(email, bookclubId)) =='FOUND')
        return 'AUTHORIZED';
    } else return 'UNAUTHORIZED';
  }

  @Post('')
  async createBookclub(
    @Headers('Authorization') token: string | undefined,
    @Body() bookclub : AddBookclub,
  ) {
    const result = await this.loadPermissionsByToken(token);
    if (result != 'UNAUTHORIZED') {
      const BC = await this.BookclubService.createBookclub(
        bookclub.isbn,
        bookclub.name,
        result,
      );
      this.BookclubService.addFounder(BC.id, result);
      return BC;
    } else throw new HttpException('NOT AUTHORIZED', HttpStatus.UNAUTHORIZED);
  }

  @Delete('/deleteBookclub/:id')
  async deleteBookclub(
    @Param('id') bookclubId: number,
    @Headers('Authorization') token: string | undefined,
  ) {
    const result = await this.loadPermissionsByTokenFounder(token,bookclubId);
    if (result != 'UNAUTHORIZED')
      return this.BookclubService.deleteBookclub(bookclubId, result);
    else throw new HttpException('NOT AUTHORIZED', HttpStatus.UNAUTHORIZED);
  }

  @Get('/mine')
  async findBookclubsByToken(
    @Headers('Authorization') token: string | undefined,){
    const result = await this.loadPermissionsByToken(token);
    if (result != 'UNAUTHORIZED') return this.BookclubService.findBookclubsInfo(result);
    else throw new HttpException('NOT AUTHORIZED', HttpStatus.UNAUTHORIZED);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async enterBookclub(
    @Param('id') bookclub : number,
    @Headers('Authorization') token : string|undefined
  ){
    const result = await this.loadPermissionsByToken(token);
    if(result == 'UNAUTHORIZED') throw new HttpException('',HttpStatus.UNAUTHORIZED);
    await this.MembershipService.findMember(bookclub,result);
    return this.BookclubService.enterBookclub(bookclub);
  }
}
