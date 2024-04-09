import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './models/token.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		JwtModule.register({
			global: true,
		}),
		MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
	],
	providers: [TokenService],
	exports: [TokenService],
})
export class TokenModule {}
