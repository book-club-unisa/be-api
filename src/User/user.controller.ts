import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from 'src/dtos/user.dto';
import { User } from 'src/Entities/User';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get('/all')
  @UsePipes(ValidationPipe)
  findAll(): Promise<User[]> {
    return this.UserService.getAllUsers();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/search')
  @UsePipes(ValidationPipe)
  findUser(@Body() user: User) {
    return this.UserService.findUser(user.email, user.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/search/:email')
  @UsePipes(ValidationPipe)
  async findUserByEmail(@Param('email') email: string) {
    const result = await this.UserService.findUserByEmail(email);
    if (result.email == '') throw new HttpException('Email not found', 400);
    else return result;
  }

  @Post('/update')
  @UsePipes(ValidationPipe)
  updateUser(@Body() user: UserDto) {
    return this.UserService.updateUser(user);
  }

  @Post('/create')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(ValidationPipe)
  async createUser(@Body() user: UserDto) {
    return this.UserService.createUser(user);
  }

  @Delete('/delete/:email')
  @UsePipes(ValidationPipe)
  deleteUser(@Param('email') email: string) {
    return this.UserService.deleteUser(email);
  }
}
