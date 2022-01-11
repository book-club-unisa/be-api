import { Book } from "src/Entities/Book";
import { Member } from "src/entities/Member";
import { ReadGoal } from "src/entities/ReadGoal";

export class BookclubInfo{
    id : number
    name : string
    founderEmail : string
    Book : Book
    Members : Member[]
    lastReadGoal : ReadGoal
    secondLastReadGoal : ReadGoal
}