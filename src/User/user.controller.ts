import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from 'src/dtos/user.dto';
import { User } from 'src/Entities/User';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserService, userPermissions } from './user.service';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

function exitUnauthorized() {
  throw new HttpException(undefined, HttpStatus.UNAUTHORIZED);
}

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  async loadPermissionsByToken(token: string | undefined): Promise<string> {
    if (!token)  return 'UNAUTHORIZED';
    
    const plainData = Buffer.from(token, 'base64').toString();
    const [email, password] = plainData.split('@@@');
    if ((await this.UserService.findUser(email, password)) == 'FOUND') return email;
    else return 'UNAUTHORIZED';
  }

  @Post('')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(ValidationPipe)
  async createUser(@Body() user: UserDto) {
    return this.UserService.createUser(user);
  }

  @Get('')
  @UsePipes(ValidationPipe)
  findAll(): Promise<User[]> {
    return this.UserService.getAllUsers();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('sign-in')
  @UsePipes(ValidationPipe)
  async signIn(@Body() user: User) {
    const token = await this.UserService.retrieveTokenByCredentials(
      user.email,
      user.password,
    );
    if (!token) {
      throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
    }
    return token;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/search/:email')
  @UsePipes(ValidationPipe)
  async findUserByEmail(@Param('email') email: string) {
    const result = await this.UserService.findUserByEmail(email);
    if (result.email == '') throw new HttpException('Email not found', 400);
    else return result;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/emailByToken')
  async getEmailByToken(@Headers('Authorization') token: string | undefined){
    const result = await this.loadPermissionsByToken(token);
    if (result != 'UNAUTHORIZED') {
      const tmp = await this.UserService.findUserByEmail(result);
      console.log(tmp);
      return tmp;
    }
  }

  @Put(':email')
  @UsePipes(ValidationPipe)
  async updateUser(
    @Headers('Authorization') token: string | undefined,
    @Param('email') email: string,
    @Body() updateUser: UpdateUserDto,
  ) {
    const permissions = await this.UserService.loadPermissionsByToken(token);
    if (!permissions.includes(userPermissions.updateAccount)) {
      exitUnauthorized();
    }
    return this.UserService.updateUserByEmail(email, updateUser);
  }

  @Delete(':email')
  @UsePipes(ValidationPipe)
  async deleteUser(
    @Headers('Authorization') token: string | undefined,
    @Param('email') email: string,
  ) {
    const permissions = await this.UserService.loadPermissionsByToken(token);
    if (!permissions.includes(userPermissions.deleteAccount)) {
      exitUnauthorized();
    }
    return this.UserService.deleteUser(email);
  }
}
