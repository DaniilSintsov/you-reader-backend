import { Injectable } from '@nestjs/common';
import { createCanvas } from 'canvas';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import { FileUpload } from 'graphql-upload';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { S3ClientService } from 'src/s3-client/s3-client.service';
import { BookService } from 'src/book/book.service';
import mongoose, { Types } from 'mongoose';
import { Book } from 'src/book/models/book.model';

@Injectable()
export class ReaderService {
	constructor(
		private readonly s3Client: S3ClientService,
		private readonly bookService: BookService,
	) {}

	async deleteFile(bookId: mongoose.Schema.Types.ObjectId): Promise<Book> {
		const book = await this.bookService.deleteBook(bookId);
		await this.s3Client.deleteFile(book.file);
		await this.s3Client.deleteFile(book.cover);
		return book;
	}

	async uploadFile(
		buffer: Buffer,
		file: FileUpload,
		userId: mongoose.Schema.Types.ObjectId,
	): Promise<Book> {
		try {
			const pdfDoc = await pdfjsLib.getDocument({
				data: new Uint8Array(buffer),
			}).promise;

			const { title, author } = await this.getMetadata(
				pdfDoc,
				file.filename,
			);
			const imgBuffer = await this.getImgBuffer(pdfDoc);

			const bookId: Types.ObjectId = new Types.ObjectId();

			const coverLocation = await this.s3Client.uploadFile(
				imgBuffer,
				`${bookId}.png`,
				String(userId),
			);
			const fileLocation = await this.s3Client.uploadFile(
				buffer,
				`${bookId}.pdf`,
				String(userId),
			);

			return await this.bookService.createBook({
				_id: bookId,
				user: userId,
				title,
				author,
				cover: coverLocation,
				file: fileLocation,
				isFavorite: false,
				pagesCount: pdfDoc.numPages,
				currentPage: 1,
			});
		} catch (error) {
			throw error;
		}
	}

	private async getMetadata(
		pdfDoc: PDFDocumentProxy,
		filename: string,
	): Promise<{ title: string; author?: string }> {
		const data = await pdfDoc.getMetadata();
		const info = data.info;

		const title = info?.['Title'] ? info['Title'].trim() : filename.trim();
		const author = info?.['Author'] ? info['Author'].trim() : undefined;

		return { title, author };
	}

	private async getImgBuffer(pdfDoc: PDFDocumentProxy): Promise<Buffer> {
		const page = await pdfDoc.getPage(1);
		const viewport = page.getViewport({ scale: 1.0 });

		const canvas = createCanvas(viewport.width, viewport.height);
		const context = canvas.getContext('2d');

		await page.render({
			viewport: viewport,
			canvasContext: context as any,
		}).promise;

		return canvas.toBuffer('image/png');
	}
}
