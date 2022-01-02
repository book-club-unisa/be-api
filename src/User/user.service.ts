import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dtos/user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/Entities/User';
import { SHA256 } from 'sha2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find(); //SELECT * from user
  }

  async findUserByEmail(email: string) {
    try {
      const searchedUser = await this.usersRepository.findOneOrFail(email);
      return new User(searchedUser);
    } catch (err) {
      return {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      };
    }
  }

  async createUser(user: UserDto) {
    const tmp = this.findUserByEmail(user.email);
    if ((await tmp).email == '') {
      const shaBuffer = SHA256(user.password);
      const sha2pass = shaBuffer.toString('base64');
      const newUser = this.usersRepository.create({
        email: user.email,
        password: sha2pass,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      const insertedUser = this.usersRepository.save(newUser);
      return insertedUser;
    } else throw new HttpException('Email alredy taken', 409);
  }

  async updateUser(user: UserDto): Promise<User> {
    const updatedUser = await this.usersRepository.save(user);
    return new User(updatedUser);
  }

  async findUser(email: string, password: string): Promise<User> {
    const shaBuffer = SHA256(password);
    const sha2pass = shaBuffer.toString('base64');
    try {
      const userFound = await this.usersRepository.findOneOrFail(email);
      if (userFound.password == sha2pass) {
        return userFound;
      } else
        throw new HttpException(
          'Invalid Email or Password',
          HttpStatus.BAD_REQUEST,
        );
    } catch (err) {
      throw new HttpException(
        'Invalid Email or Password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(email: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (user.email == '') throw new HttpException('Invalid Email', 400);
    await this.usersRepository.remove(user);
    user.password = '';
    return user;
  }
}
