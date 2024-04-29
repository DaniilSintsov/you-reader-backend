import { Module } from '@nestjs/common';
import { ReaderResolver } from './reader.resolver';
import { ReaderService } from './reader.service';
import { TokenModule } from 'src/token/token.module';
import { BookModule } from 'src/book/book.module';
import { S3ClientModule } from 'src/s3-client/s3-client.module';

@Module({
	imports: [TokenModule, BookModule, S3ClientModule],
	providers: [ReaderResolver, ReaderService],
})
export class ReaderModule {}
