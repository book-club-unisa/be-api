import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dtos/user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/Entities/User';
import { SHA256 } from 'sha2';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

// TODO: Bring User's code inside /src/User folder

export const userPermissions = {
  updateAccount: 'userPermissions:updateAccount',
  deleteAccount: 'userPermissions:deleteAccount',
};

function makeSafe(str: string): string {
  const shaBuffer = SHA256(str);
  return shaBuffer.toString('base64');
}

function generateToken(email: string, password: string) {
  const separator = '@@@';
  return Buffer.from(`${email}${separator}${password}`).toString('base64');
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(user: UserDto) {
    const userByEmail = await this.usersRepository.findOne(user.email);
    if (userByEmail) {
      throw new HttpException('Email already taken', 409);
    }
    const sha2pass = makeSafe(user.password);
    const userToInsert = this.usersRepository.create({
      email: user.email,
      password: sha2pass,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    return await this.usersRepository.save(userToInsert);
  }

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
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
    const safePass = makeSafe(password);
    if (userByEmail && userByEmail.password == safePass) {
      return generateToken(email, userByEmail.password);
    }
    return undefined;
  }

  async updateUserByEmail(
    email: string,
    updateUser: UpdateUserDto,
  ): Promise<void> {
    const update = await this.usersRepository.update(email, updateUser);
    if (update.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteUser(email: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.usersRepository.remove(user);
    delete user.password;
    return user;
  }

  async loadPermissionsByToken(token: string | undefined): Promise<string[]> {
    if (!token) {
      return [];
    }
    const plainData = Buffer.from(token, 'base64').toString();
    const [email, password] = plainData.split('@@@');
    const data = await this.usersRepository.find({ email, password });
    if (data.length) {
      // const loadedUser = data[0];
      return [
        userPermissions.updateAccount,
        userPermissions.deleteAccount,
        // ...
      ];
    }
    return [];
  }
}
