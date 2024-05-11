import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Book } from './models/book.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request, Response } from 'express';
import { BookService } from './book.service';
import { ITokenPayload } from 'src/shared/types/common-types';
import { PaginationArgs } from './dto/args/pagination.args';
import mongoose from 'mongoose';
import { BooksWithTotalCount } from './dto/books-with-total-count.dto';

@Resolver(() => Book)
export class BookResolver {
	constructor(private readonly bookService: BookService) {}

	@UseGuards(AuthGuard)
	@Query(() => BooksWithTotalCount)
	async getAllBooks(
		@Args() paginationArgs: PaginationArgs,
		@Context('req') request: Request,
		@Context('res') response: Response,
	): Promise<BooksWithTotalCount> {
		const data = await this.bookService.getAllBooksOfCurrentUser(
			(request['user'] as ITokenPayload).userId,
			paginationArgs?.offset,
			paginationArgs?.limit,
		);
		response.cookie('x-total-count', data.totalCount.toString());
		return data;
	}

	@UseGuards(AuthGuard)
	@Query(() => BooksWithTotalCount)
	async getAllFavoriteBooks(
		@Args() paginationArgs: PaginationArgs,
		@Context('req') request: Request,
		@Context('res') response: Response,
	): Promise<BooksWithTotalCount> {
		const data = await this.bookService.getAllFavoriteBooksOfCurrentUser(
			(request['user'] as ITokenPayload).userId,
			paginationArgs?.offset,
			paginationArgs?.limit,
		);
		response.cookie('x-total-count', data.totalCount.toString());
		return data;
	}

	@UseGuards(AuthGuard)
	@Query(() => Book, { nullable: true })
	async getBook(
		@Args('bookId', { type: () => String })
		bookId: mongoose.Schema.Types.ObjectId,
	): Promise<Book> {
		return await this.bookService.getBook(bookId);
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

	@UseGuards(AuthGuard)
	@Mutation(() => Book)
	async setCurrentPage(
		@Args('bookId', { type: () => String })
		bookId: mongoose.Schema.Types.ObjectId,
		@Args('pageNumber', { type: () => Int }) pageNumber: number,
	): Promise<Book> {
		return await this.bookService.setCurrentPage(bookId, pageNumber);
	}
}
