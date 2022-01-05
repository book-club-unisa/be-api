import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({
    type: 'varchar',
    name: 'email',
    default: '',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'firstName',
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    name: 'lastName',
    nullable: false,
  })
  lastName: string;

  @Exclude()
  @Column({
    type: 'varchar',
    name: 'password',
    nullable: false,
  })
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}