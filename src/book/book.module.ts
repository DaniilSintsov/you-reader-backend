import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './models/book.model';
import { BookResolver } from './book.resolver';
import { TokenModule } from 'src/token/token.module';

@Module({
	imports: [
		TokenModule,
		MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
	],
	providers: [BookService, BookResolver],
	exports: [BookService],
})
export class BookModule {}
