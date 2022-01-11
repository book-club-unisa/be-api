import { Body, Controller, Headers, HttpException, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { BookclubService } from 'src/Bookclub/bookclub.service';
import { UserService } from 'src/User/user.service';
import { AddODL } from './AddODL';
import { OdlService } from './odl.service';

@Controller('')
export class OdlController {

    @Inject(OdlService) private readonly OdlService : OdlService;
    @Inject(BookclubService) private readonly BookclubService: BookclubService;
    @Inject(UserService) private readonly UserService: UserService;

  async loadPermissionsByTokenFounder(token: string | undefined,bookclubId: number): Promise<string> {
    if (!token) {
      return 'UNAUTHORIZED';
    }
    const plainData = Buffer.from(token, 'base64').toString();
    const [email, password] = plainData.split('@@@');
    if ((await this.UserService.findUser(email, password)) == 'FOUND') {
      if ((await this.BookclubService.validateFounder(email, bookclubId)) =='FOUND') return 'AUTHORIZED';
    } else return 'UNAUTHORIZED';
  }

    @Post('bookclubs/:id/update-last-read-goal')
    async updateLastReadGoal(
        @Param('id') bookclubId : number,
        @Headers('Authorization') token : string|undefined,
        @Body() milestone:AddODL
    ){
        const result = await this.loadPermissionsByTokenFounder(token,bookclubId);
        if(result == 'UNAUTHORIZED') throw new HttpException('',HttpStatus.UNAUTHORIZED);
        const newODL : number = parseInt(milestone.numPages,10);
        if(newODL == NaN || newODL<=0) throw new HttpException('INVALID PDL', HttpStatus.BAD_REQUEST);
        const result2 = await this.OdlService.checkStatus(bookclubId);
        if(result2 == 'CREATE') return this.OdlService.createODL(bookclubId,newODL);     
        else return this.OdlService.updateODL(bookclubId,newODL);
    }
}
