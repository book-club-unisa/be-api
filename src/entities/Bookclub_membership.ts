import { Column, Entity, PrimaryColumn,} from "typeorm";

@Entity()
export class Bookclub_membership{
    //chiedere a umberto come importaare le chiavi esterne @manytoone
    //vedere chiavi esterne in typescript
    @PrimaryColumn({
        name:'bookclub_id',
        type:'int',
    })
    bookclubId: number;

    @Column({
        name:'user_email',
        type:'varchar',
    })
    userEmail: string;

}