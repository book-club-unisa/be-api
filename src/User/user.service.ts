import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './user.dto';
import { Repository } from 'typeorm';
import { User } from './User';
import { SHA256 } from 'sha2';

// TODO: Bring User's code inside /src/User folder

export const userPermissions = {
  updateAccount: 'userPermissions:updateAccount',
  deleteAccount: 'userPermissions:deleteAccount',
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  makeSafe(str: string): string {
    const shaBuffer = SHA256(str);
    return shaBuffer.toString('base64');
  }

  generateToken(email: string, password: string) {
    const separator = '@@@';
    const token = Buffer.from(`${email}${separator}${password}`).toString(
      'base64',
    );
    return token;
  }

  async createUser(user: UserDto) {
    const userByEmail = await this.usersRepository.findOne(user.email);
    if (userByEmail) {
      throw new HttpException('Email already taken', 409);
    }
    const sha2pass = this.makeSafe(user.password);
    const userToInsert = this.usersRepository.create({
      email: user.email,
      password: sha2pass,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    return await this.usersRepository.save(userToInsert);
  }

  async findUser(email: string, password: string): Promise<string> {
    const data = await this.usersRepository.find({ email, password });
    if (data.length) return 'FOUND';
    else 'NOT FOUND';
  }

  async findUserByEmail(email: string) {
    try {
      const searchedUser = await this.usersRepository.findOneOrFail(email);
      return new User(searchedUser);
    } catch (err) {
      throw new HttpException('User not found', 404);
    }
  }

  async retrieveTokenByCredentials(
    email: string,
    password: string,
  ): Promise<string | undefined> {
    const userByEmail = await this.usersRepository.findOne(email);
    const safePass = this.makeSafe(password);
    if (userByEmail && userByEmail.password == safePass) {
      return this.generateToken(email, userByEmail.password);
    }
    return undefined;
  }

  async deleteUser(email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.usersRepository.remove(user);
    delete user.password;
    const deletedUser = {
      email: email,
      status: 'DELETED',
    };
    return deletedUser;
  }
}
