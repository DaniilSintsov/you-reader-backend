import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthResolver } from './auth.resolver';
import { TokenModule } from 'src/token/token.module';

@Module({
	imports: [TokenModule, UserModule],
	providers: [AuthResolver, AuthService],
})
export class AuthModule {}
