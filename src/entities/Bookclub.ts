import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './Book';
import { User } from './User';

@Entity()
export class Bookclub {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  @PrimaryColumn()
  id: number;

  @Column({
    name: 'bookclubName',
    type: 'varchar',
    nullable: false,
  })
  bookclubName: string;

  
  @ManyToOne(() => Book, book => book.isbn)
  book: string;

  
  @ManyToOne(()=> User, user => user.email)
  founder: string;
}