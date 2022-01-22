import { MinLength } from 'class-validator';

export class BookDto {
  isbn: string;

  @MinLength(2)
  title: string;

  author: string;

  pages_count: number;

  editor: string;

  description: string;

  cover_url: string;
}
