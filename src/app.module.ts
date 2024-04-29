import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from './token/token.module';
import { BookModule } from './book/book.module';
import { ReaderModule } from './reader/reader.module';
import { S3ClientModule } from './s3-client/s3-client.module';

@Module({
	imports: [
		UserModule,
		AuthModule,
		TokenModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			context: (context) => context,
			autoSchemaFile: true,
		}),
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get('MONGO_URI'),
			}),
		}),
		BookModule,
		ReaderModule,
		S3ClientModule,
	],
})
export class AppModule {}
