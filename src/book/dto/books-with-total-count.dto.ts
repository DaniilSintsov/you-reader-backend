import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Book } from '../models/book.model';

@ObjectType()
export class BooksWithTotalCount {
	@Field(() => [Book])
	data: Book[];

	@Field(() => Int)
	totalCount: number;
}
