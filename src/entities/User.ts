import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, } from "typeorm";

@Entity()
export class User{

    
    @PrimaryColumn({
        unique:true,
        name: 'email',
        type: 'varchar',
        nullable: false,
    })
    email: string;

    @Column({
        type: 'varchar',
        name: 'firstname',
        nullable: false,
    })
    firstname: string;

    @Column({
        type: 'varchar',
        name: 'lastname',
        nullable: false,
    })
    lastname: string;

    @Column({
        type: 'varchar',
        name: 'password',
        nullable: false,
    })
    password: string;
}