import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({ origin: true, credentials: true });
	app.use(cookieParser());
	app.use(
		graphqlUploadExpress({ maxFileSize: 500 * 1024 * 1024, maxFiles: 1 }),
	);
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(5000);
}
bootstrap();
