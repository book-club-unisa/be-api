import { Column, Entity, PrimaryColumn, } from "typeorm";

@Entity()
export class Book{


    @Column({
        name:'title',
        type:'varchar',
    })
    title: string;

    @Column({
        name:'author',
        type:'varchar',
        nullable: false,
    })
    author: string;

    @Column({
        name:'pages_count',
        type:'int',
        nullable: false,
    })
    pages_count: number;

    @Column({
        name:'editor',
        type:'varchar',
        nullable: false,
    })
    editor: string;

    @Column({
        name:'description',
        type:'varchar',
        nullable: false,
    })
    description: string;

    @Column({
        name:'cover_url',
        type:'varchar',
        nullable: false,
    })
    cover_url: string;

    @PrimaryColumn({
        name: 'isbn',
     })
     isbn: string;

}