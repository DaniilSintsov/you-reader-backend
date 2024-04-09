import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';
import { LoginInput } from './dto/input/login.input';
import * as bcryptjs from 'bcryptjs';
import { SignupInput } from './dto/input/signup.input';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
	) {}

	async signup(signupData: SignupInput): Promise<User> {
		const candidate = await this.userService.getUserByEmail(
			signupData.email,
		);
		if (candidate) {
			throw new BadRequestException('Email is already in use');
		}

		const password = await bcryptjs.hash(signupData.password, 10);
		const newUser = await this.userService.createUser({
			...signupData,
			password,
		});
		return await this.registerUserAndGenerateTokens(newUser);
	}

	async login(loginData: LoginInput): Promise<User> {
		const user = await this.userService.getUserByEmail(loginData.email);
		if (!user) {
			throw new UnauthorizedException('Email incorrect');
		}

		const isPassportValid = await bcryptjs.compare(
			loginData.password,
			user.password,
		);
		if (!isPassportValid) {
			throw new UnauthorizedException('Password incorrect');
		}

		return await this.registerUserAndGenerateTokens(user);
	}

	async refresh(refreshToken: string): Promise<User> {
		if (!refreshToken) {
			throw new UnauthorizedException();
		}

		const payload =
			await this.tokenService.verifyRefreshToken(refreshToken);
		const tokenFromDb = await this.tokenService.findToken(refreshToken);
		if (!payload || !tokenFromDb) {
			throw new UnauthorizedException();
		}

		const user = await this.userService.findById(payload.userId);
		return await this.registerUserAndGenerateTokens(user);
	}

	async logout(refreshToken: string) {
		await this.tokenService.removeToken(refreshToken);
	}

	private async registerUserAndGenerateTokens(user: User): Promise<User> {
		const { _id: userId, email } = user;
		const tokens = await this.tokenService.generateTokens({
			userId,
			email,
		});
		await this.tokenService.saveToken({
			userId,
			refreshToken: tokens.refreshToken,
		});

		return Object.assign(user, tokens);
	}
}
