import {
  Controller,
  Delete,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { BookclubService } from './bookclub.service';
import { UserService } from 'src/User/user.service';

@Controller('bookclub')
export class BookclubController {
  constructor(private readonly BookclubService: BookclubService) {}
  @Inject(UserService) private readonly UserService: UserService;

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

  @Post('/:isbn/createBookclub/:name')
  async createBookclub(
    @Param('isbn') isbn: string,
    @Headers('Authorization') token: string | undefined,
    @Param('name') bookclubName: string,
  ) {
    const result = await this.loadPermissionsByToken(token);
    if (result != 'UNAUTHORIZED') {
      const BC = await this.BookclubService.createBookclub(
        isbn,
        bookclubName,
        result,
      );
      this.BookclubService.addFounder(BC.id, result);
      return BC;
    } else throw new HttpException('NOT AUTHORIZED', HttpStatus.UNAUTHORIZED);
  }

  @Delete('/deleteBookclub/:name')
  async deleteBookclub(
    @Param('name') bookclubName: string,
    @Headers('Authorization') token: string | undefined,
  ) {
    const result = await this.loadPermissionsByToken(token);
    if (result != 'UNAUTHORIZED')
      return this.BookclubService.deleteBookclub(bookclubName, result);
    else throw new HttpException('NOT AUTHORIZED', HttpStatus.UNAUTHORIZED);
  }
}
