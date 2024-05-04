import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './models/book.model';
import mongoose, { Model } from 'mongoose';
import { ICreateBookData } from 'src/shared/types';

@Injectable()
export class BookService {
	constructor(
		@InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
	) {}

	async createBook(bookData: ICreateBookData): Promise<Book> {
		const newBook = new this.bookModel(bookData);
		return await newBook.save();
	}

	async getAllBooksOfCurrentUser(
		userId: mongoose.Schema.Types.ObjectId,
		skip?: number,
		limit?: number,
	): Promise<Book[] | []> {
		let books = this.bookModel.find({ user: userId });
		if (skip) books = books.skip(skip);
		if (limit) books = books.limit(limit);
		return await books;
	}

	async getAllFavoriteBooksOfCurrentUser(
		userId: mongoose.Schema.Types.ObjectId,
		skip?: number,
		limit?: number,
	): Promise<Book[] | []> {
		let books = this.bookModel.find({ user: userId, isFavorite: true });
		if (skip) books = books.skip(skip);
		if (limit) books = books.limit(limit);
		return await books;
	}

	async setIsFavorite(
		bookId: mongoose.Schema.Types.ObjectId,
		isFavorite: boolean,
	): Promise<Book> {
		return await this.bookModel.findOneAndUpdate(
			{ _id: bookId },
			{ $set: { isFavorite } },
			{ new: true },
		);
	}

	async deleteBook(bookId: mongoose.Schema.Types.ObjectId): Promise<Book> {
		return await this.bookModel.findOneAndDelete({ _id: bookId });
	}
}
