import {
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { Book} from './Book';
  import { User } from './User';
  
  @Entity()
  export class ReadSession {
    @ManyToOne(() => Book, (book) => book.isbn)
    @Column({
      name: 'bookIsbn',
      type: 'varchar',
      nullable : false
    })
    book: string;
  
    @ManyToOne(() => User, (user) => user.email)
    @Column({
      name: 'userEmail',
      type: 'varchar',
    })
    user: string;
  
    @PrimaryGeneratedColumn({
      name: 'sessionId',
    })
    @PrimaryColumn()
    id: number;
  
    @Column({
      name : 'State',
      type : 'varchar'
    })
    State : string
}