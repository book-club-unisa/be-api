import {
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { ReadSession } from '../ReadSession/ReadSession';
  
  @Entity()
  export class PDL {

    @PrimaryGeneratedColumn({
        name: 'id',
    })
    @PrimaryColumn()
    id: number;
    

    @ManyToOne(() => ReadSession, (readSession) => readSession.id)
    @Column({
      name : 'sessionId',
      type: 'int',
      nullable : false,
    })
    session: number;

    @Column({
        name : 'PagesCount',
        type : 'int'
    })
    pages : number


    @Column({
      name: 'CreateDate',
      type: 'datetime',
    })
    createDate : Date;   
}