import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bookclub{

    @PrimaryGeneratedColumn({

        name: 'id',
    })
    @PrimaryColumn()
    id: number;

    @Column({
        name:'bookclub_name',
        type: 'varchar',
        nullable: false,
    })
    bookclub_name: string;

    @Column({
        name:'book_isbn',
        type:'varchar',
        nullable:false,
    })
    book_isbn: string;

    @Column({
        name:'founder_email',
        type:'varchar',
        nullable: false,
    })
    founder_email: string;

}