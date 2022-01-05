import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';
import { Bookclub } from './Bookclub';
import { User } from './User';

@Entity()
export class Bookclub_membership {
  @ManyToOne(() => Bookclub, Bookclub=> Bookclub.id)
  @Column({
    name : 'bookclubId',
    type : 'int'
  })
  bookclub: number;

  @ManyToOne(()=> User, User => User.email)
  @Column({
    name : 'userEmail',
    type : 'varchar'
  })
  user: string;

  @PrimaryGeneratedColumn({
    name : 'membershipId'
  })
  @PrimaryColumn()
  membershipId : number
}
