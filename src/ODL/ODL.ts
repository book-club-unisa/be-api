import {
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Bookclub } from '../bookclub/Bookclub';
  
  @Entity()
  export class ODL {

    @PrimaryGeneratedColumn({
        name: 'id',
    })
    @PrimaryColumn()
    id: number;
    

    @ManyToOne(() => Bookclub, (bookclub) => bookclub.id)
    @Column({
      name : 'bookclubId',
      type: 'int',
      nullable : false,
    })
    bookclub: number;

    @Column({
        name : 'PagesCount',
        type : 'int'
    })
    pages : number   
}