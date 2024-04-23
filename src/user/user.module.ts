import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { UserResolver } from './user.resolver';
import { TokenModule } from 'src/token/token.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		TokenModule,
	],
	providers: [UserService, UserResolver],
	exports: [UserService],
})
export class UserModule {}
