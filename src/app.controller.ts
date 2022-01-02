/*import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
//import { AppService } from './app.service';
import { User } from './User/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findAll(): User[] {
    return this.appService.findAll();
  }

  @Get(':email')
  findOne(@Param('email') email: string): User {
    return this.appService.findOne(email);
  }

  @Delete(':removeE')
  destroy(@Param('removeE') removeE: string): User {
    console.log('Remove selected...');
    return this.appService.destroy(removeE);
  }

  /*@Post()
  async create(@Body() user: User){
    return this.appService.create(user);
  }
}*/
