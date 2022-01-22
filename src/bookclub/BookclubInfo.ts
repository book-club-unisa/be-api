import { Book } from '../Book/Book';
import { Member } from '../Membership/Member';
import { ReadGoal } from '../ODL/ReadGoal';

export class BookclubInfo {
  id: number;
  name: string;
  founderEmail: string;
  Book: Book;
  Members: Member[];
  lastReadGoal: ReadGoal;
  secondLastReadGoal: ReadGoal;
}
