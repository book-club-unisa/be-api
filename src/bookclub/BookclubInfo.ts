import { Book } from "src/Entities/Book";
import { Bookclub } from "src/Entities/Bookclub";
import { Bookclub_membership } from "src/Entities/Bookclub_membership";

export class BoockclubInfo{
    Bookclub : Bookclub
    Book : Book
    Members : Bookclub_membership[]
    ODLGoal : number
    ODLMembers : Bookclub_membership[]
    PDLPercentage : number
}