import { Controller, Headers, HttpException, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { Bookclub_membership } from 'src/Entities/Bookclub_membership';
import { MembershipService } from 'src/Membership/membership.service';
import { UserService } from 'src/User/user.service';
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

  @Post('bookclub/:id/addPDL/:pages')
  async addPDL(
      @Param('id') bookclub : number,
      @Headers('Authorization') token : string|undefined,
      @Param('pages') pages : string
  ){
    const result = await this.loadPermissionsByToken(token,bookclub);
    if(result == 'UNAUTHORIZED') throw new HttpException('CANNOT ADD PDL OF A BOOKCLUB YOU ARE NOT A MEMBER OF', HttpStatus.UNAUTHORIZED);
    const newPDL = parseInt(pages,10);
    if(!newPDL || newPDL<0) throw new HttpException('INVALID PDL', HttpStatus.BAD_REQUEST);
    return this.PDLService.addPDL(newPDL,result, bookclub);
  }

}