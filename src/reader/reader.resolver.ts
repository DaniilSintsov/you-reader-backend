import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ReaderService } from './reader.service';
import { Request } from 'express';
import { ITokenPayload } from 'src/shared/types/common-types';
import { Book } from 'src/book/models/book.model';
import mongoose from 'mongoose';

@Resolver()
export class ReaderResolver {
	constructor(private readerService: ReaderService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Book)
	async uploadFile(
		@Args({ name: 'file', type: () => GraphQLUpload })
		file: FileUpload,
		@Context('req') request: Request,
	): Promise<Book> {
		try {
			const { createReadStream, mimetype } = file;

			if (mimetype !== 'application/pdf') {
				throw new Error('Only PDF files are allowed');
			}

			const stream = createReadStream();
			const chunks = [];

			await new Promise<Buffer>((resolve, reject) => {
				let buffer: Buffer;

				stream.on('data', (chunk) => {
					chunks.push(chunk);
				});

				stream.on('end', () => {
					buffer = Buffer.concat(chunks);
					resolve(buffer);
				});

				stream.on('error', reject);
			});

			const buffer = Buffer.concat(chunks);
			return this.readerService.uploadFile(
				buffer,
				file,
				(request['user'] as ITokenPayload).userId,
			);
		} catch (error) {
			throw new Error(error);
		}
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Book)
	async deleteFile(
		@Args('bookId', { type: () => String })
		bookId: mongoose.Schema.Types.ObjectId,
	): Promise<Book> {
		try {
			return this.readerService.deleteFile(bookId);
		} catch (error) {
			throw new Error(error);
		}
	}
}
