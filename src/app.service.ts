/*import { Injectable } from '@nestjs/common';
import { User } from './User/user.entity';

@Injectable()
export class AppService {
  private readonly users: User[] = [
    {
      email: 'marco.palmisciano1@studenti.unisa.it',
      firstName: 'Marco',
      lastName: 'Palmisciano',
      password: 'Marco200',
    },
    {
      email: 'peppe.ragosta@studenti.unisa.it',
      firstName: 'Peppe',
      lastName: 'Ragosta',
      password: 'Peppe199',
    },
  ];

  createUser(user: User) {
    const newUser = { email: user.email, firstName: user.firstName, ...user };
    console.log(newUser);
    this.users.push(newUser);
    return this.findOne(user.email);
  }

  destroy(email: string): User {
    const deleteUser = this.findOne(email);
    const indexRemove = this.users.indexOf(deleteUser);
    this.users.splice(indexRemove, 1);
    return deleteUser;
  }

  findOne(email: string): User {
    console.log('Searching user with email ' + email);
    return this.users.find((user) => user.email == email);
  }

  findAll(): User[] {
    return this.users;
  }
}*/
