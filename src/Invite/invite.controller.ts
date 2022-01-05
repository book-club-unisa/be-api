import { Body, Controller, Delete, Get, Headers, HttpCode, HttpException, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { IsEmail } from 'class-validator';
import { BookclubController } from 'src/Bookclub/bookclub.controller';
import { BookclubService } from 'src/Bookclub/bookclub.service';
import { UserService } from 'src/User/user.service';
import { InviteService } from './invite.service';

@Controller('')
export class InviteController {
    constructor (private readonly InviteService : InviteService) {}
    @Inject (BookclubService) private readonly BookclubService : BookclubService
    @Inject (UserService) private readonly UserService : UserService 

    async loadPermissionsByTokenFounder(token: string | undefined, bookclubId: number): Promise<string> {
        if (!token) {
          return 'UNAUTHORIZED';
        }
        const plainData = Buffer.from(token, 'base64').toString();
        const [email, password] = plainData.split('@@@');
        if(await this.UserService.findUser(email,password) == 'FOUND')
        {
            if ((await this.BookclubService.validateFounder(email, bookclubId)) == 'FOUND')  return 'AUTHORIZED';
        }
        else return 'UNAUTHORIZED';
    }

    async loadPermissionsByTokenUser(token: string | undefined): Promise<string> {
        if (!token) {
          return 'UNAUTHORIZED';
        }
        const plainData = Buffer.from(token, 'base64').toString();
        const [email, password] = plainData.split('@@@');
        if(await this.UserService.findUser(email,password) == 'FOUND') return email;
        else return 'UNAUTHORIZED';
    }

    @Get('bookclub/:id/inviteUser/:email')
    async inviteUser(
        @Param('id') bookclubId:number, 
        @Param('email') userEmail:string,
        @Headers('Authorization') token : string | undefined){
            const result = await this.loadPermissionsByTokenFounder(token,bookclubId);
            if(result == 'AUTHORIZED')  return this.InviteService.inviteUser(userEmail,bookclubId);
            
            else throw new HttpException('NOT AUTHORIZED',HttpStatus.UNAUTHORIZED);
        }

    
    @Delete('bookclub/:id/deleteInvite/:inviteId')
    async deleteInvite(
        @Param('id') bookclubId:number, 
        @Param('inviteId') inviteId:number,
        @Headers('Authorization') token : string | undefined){
            const result = await this.loadPermissionsByTokenFounder(token,bookclubId);
            if(result == 'AUTHORIZED')  return this.InviteService.deleteInvite(inviteId,bookclubId);
            else throw new HttpException('NOT AUTHORIZED',HttpStatus.UNAUTHORIZED);
        }

    @Get('invite/getInvites/accept/:inviteId')
    async acceptInvite(
        @Param('inviteId') inviteId : number,
        @Headers('Authorization') token : string | undefined){
        const result = await this.loadPermissionsByTokenUser(token);
        if (result != 'UNAUTHORIZED') return this.InviteService.acceptInvite(inviteId,result);
        else throw new HttpException('NOT AUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    @Get('invite/getInvites/refuse/:inviteId')
    async refuseInvite(
        @Param('inviteId') inviteId : number,
        @Headers('Authorization') token : string | undefined){
        const result = await this.loadPermissionsByTokenUser(token);
        if (result != 'UNAUTHORIZED') return this.InviteService.refuseInvite(inviteId,result);
        else throw new HttpException('NOT AUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
}
