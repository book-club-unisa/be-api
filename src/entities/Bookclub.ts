import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './Book';
import { User } from './User';

@Entity()
export class Bookclub {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
  })
  @PrimaryColumn()
  id: number;

  @Column({
    name: 'bookclubName',
    type: 'varchar',
    nullable: false,
  })
  bookclubName: string;

  @ManyToOne(() => Book, (book) => book.isbn)
  @Column({
    name: 'bookIsbn',
    type: 'varchar',
    nullable: false,
  })
  book: string;

  @ManyToOne(() => User, (user) => user.email)
  @Column({
    name: 'founderEmail',
    type: 'varchar',
    nullable: false,
  })
  founder: string;
}
