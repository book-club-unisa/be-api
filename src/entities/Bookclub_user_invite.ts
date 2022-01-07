import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bookclub } from './Bookclub';
import { User } from './User';

@Entity()
export class Bookclub_user_invite {
  @PrimaryGeneratedColumn({
    name: 'inviteId',
  })
  @PrimaryColumn()
  inviteId: number;

  @ManyToOne(() => Bookclub, (Bookclub) => Bookclub.id)
  @Column({
    name: 'bookclubId',
    type: 'int',
  })
  bookclub: number;

  @ManyToOne(() => User, (user) => user.email)
  @Column({
    name: 'userEmail',
    type: 'varchar',
    nullable: false,
  })
  user: string;

  @Column({
    name: 'state',
    type: 'varchar',
    nullable: false,
  })
  State: string;
}
