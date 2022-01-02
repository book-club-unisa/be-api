import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Bookclub_membership {
  @PrimaryColumn({
    name: 'bookclub_id',
    type: 'int',
  })
  bookclubId: number;

  @Column({
    name: 'user_email',
    type: 'varchar',
  })
  userEmail: string;

  // TODO: Foreign keys
}
