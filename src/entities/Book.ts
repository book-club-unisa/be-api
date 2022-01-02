import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryColumn({
    name: 'isbn',
    type: 'varchar',
  })
  isbn: string;

  @Column({
    name: 'title',
    type: 'varchar',
  })
  title: string;

  @Column({
    name: 'author',
    type: 'varchar',
    nullable: false,
  })
  author: string;

  @Column({
    name: 'pages_count',
    type: 'int',
    nullable: false,
  })
  pagesCount: number;

  @Column({
    name: 'editor',
    type: 'varchar',
    nullable: false,
  })
  editor: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @Column({
    name: 'cover_url',
    type: 'varchar',
    nullable: false,
  })
  coverUrl: string;
}
