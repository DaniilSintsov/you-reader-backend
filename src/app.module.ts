import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			context: (context) => context,
			autoSchemaFile: true,
		}),
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		UserModule,
		AuthModule,
	],
})
export class AppModule {}
