import { Body, Controller, Get, Headers, HttpException, HttpStatus, Inject, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { MembershipService } from '../Membership/membership.service';
import { UserService } from '../User/user.service';
import { AddPDL } from './AddPDL';
import { PdlService } from './PDL.service';

@Controller('')
export class PdlController {

@Inject(UserService) private readonly UserService: UserService;
@Inject(MembershipService) private readonly MembershipService : MembershipService
@Inject(PdlService) private readonly PDLService : PdlService

  async loadPermissionsByToken(token: string | undefined, bookclub : number): Promise<string> {
    if (!token) {
      return 'UNAUTHORIZED';
    }
    const plainData = Buffer.from(token, 'base64').toString();
    const [email, password] = plainData.split('@@@');
    if ((await this.UserService.findUser(email, password)) == 'FOUND')
    {
        if(await this.MembershipService.findMember(bookclub,email)) return email
    }
    else return 'UNAUTHORIZED';
  }

  async loadPermissionsByToken2(token: string | undefined): Promise<string> {
    if (!token) {
      return 'UNAUTHORIZED';
    }
    const plainData = Buffer.from(token, 'base64').toString();
    const [email, password] = plainData.split('@@@');
    if ((await this.UserService.findUser(email, password)) == 'FOUND') return email;
    else return 'UNAUTHORIZED';
  }

  @Post('bookclubs/:id/addPDL')
  @UsePipes(ValidationPipe)
  async addPDL(
      @Param('id') bookclub : number,
      @Headers('Authorization') token : string|undefined,
      @Body() pages : AddPDL 
  ){
    const result = await this.loadPermissionsByToken(token,bookclub);
    if(result == 'UNAUTHORIZED') throw new HttpException('CANNOT ADD PDL OF A BOOKCLUB YOU ARE NOT A MEMBER OF', HttpStatus.UNAUTHORIZED);
    const newPDL : number = parseInt(pages.numPages,10);
    if(newPDL == NaN || newPDL<=0) throw new HttpException('INVALID PDL', HttpStatus.BAD_REQUEST);
    return this.PDLService.addPDL(newPDL,result, bookclub);
  }


  @Get('read-sessions')
  async getReadSessions(
    @Headers('Authorization') token : string|undefined
  ){
    const result = await this.loadPermissionsByToken2(token);
    if(result == 'UNAUTHORIZED') throw new HttpException('', HttpStatus.UNAUTHORIZED);
    return await this.PDLService.getReadSessions(result);
  }

  @Get('read-sessions/get-read-activities/:id')
  async getPDLs(
    @Param('id') id : number,
    @Headers('Authorization') token : string|undefined
  ){
    const result = await this.loadPermissionsByToken2(token);
    if(result == 'UNAUTHORIZED') throw new HttpException('', HttpStatus.UNAUTHORIZED);
    return await this.PDLService.getPDLs(id, result);
  }
}
