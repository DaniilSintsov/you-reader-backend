import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './models/book.model';
import { Model } from 'mongoose';
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
}
