import { Column, Entity } from 'typeorm';

@Entity()
export class Bookclub_user_invite {
  @Column({
    name: 'bookclub_id',
    type: 'int',
    nullable: false,
  })
  bookclub_id: number;

  @Column({
    name: 'user_email',
    type: 'varchar',
    nullable: false,
  })
  user_email: string;

  @Column({
    name: 'state',
    type: 'enum',
    nullable: false,
  })
  State: string;
}
