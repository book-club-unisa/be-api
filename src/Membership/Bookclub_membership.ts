import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bookclub } from '../bookclub/Bookclub';
import { User } from '../User/User';

@Entity()
export class Bookclub_membership {
  @ManyToOne(() => Bookclub, (Bookclub) => Bookclub.id)
  @Column({
    name: 'bookclubId',
    type: 'int',
  })
  bookclub: number;

  @ManyToOne(() => User, (User) => User.email)
  @Column({
    name: 'userEmail',
    type: 'varchar',
  })
  user: string;

  @PrimaryGeneratedColumn({
    name: 'membershipId',
  })
  @PrimaryColumn()
  membershipId: number;

  @Column({
    name : 'State',
    type : 'varchar'
  })
  State : string

  @Column({
    name : 'pageReached',
    type : 'int'
  })
  pageReached : number
}
