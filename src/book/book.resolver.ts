import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Book } from './models/book.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { BookService } from './book.service';
import { ITokenPayload } from 'src/shared/types';
import { PaginationArgs } from './dto/args/pagination.args';
import mongoose from 'mongoose';

@Resolver(() => Book)
export class BookResolver {
	constructor(private readonly bookService: BookService) {}

	@UseGuards(AuthGuard)
	@Query(() => [Book])
	async getAllBooks(
		@Args() paginationArgs: PaginationArgs,
		@Context('req') request: Request,
	): Promise<Book[] | []> {
		return await this.bookService.getAllBooksOfCurrentUser(
			(request['user'] as ITokenPayload).userId,
			paginationArgs?.offset,
			paginationArgs?.limit,
		);
	}

	@UseGuards(AuthGuard)
	@Query(() => [Book])
	async getAllFavoriteBooks(
		@Args() paginationArgs: PaginationArgs,
		@Context('req') request: Request,
	): Promise<Book[] | []> {
		return await this.bookService.getAllFavoriteBooksOfCurrentUser(
			(request['user'] as ITokenPayload).userId,
			paginationArgs?.offset,
			paginationArgs?.limit,
		);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Book)
	async setIsFavorite(
		@Args('bookId', { type: () => String })
		bookId: mongoose.Schema.Types.ObjectId,
		@Args('isFavorite', { type: () => Boolean })
		isFavorite: boolean,
	): Promise<Book> {
		return await this.bookService.setIsFavorite(bookId, isFavorite);
	}
}
