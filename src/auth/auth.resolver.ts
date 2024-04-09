import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginInput } from './dto/input/login.input';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/input/signup.input';
import { Request, Response } from 'express';
import { User } from 'src/user/models/user.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';

@Resolver(() => User)
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(AuthGuard)
	@Query(() => String)
	sayHello(): string {
		return 'Hello World!';
	}

	@Mutation(() => User)
	async signup(
		@Args('signupData') signupData: SignupInput,
		@Context('res') response: Response,
	) {
		const userData = await this.authService.signup(signupData);
		response.cookie('refreshToken', userData.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		return userData;
	}

	@Mutation(() => User)
	async login(
		@Args('loginData') loginData: LoginInput,
		@Context('res') response: Response,
	) {
		const userData = await this.authService.login(loginData);
		response.cookie('refreshToken', userData.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		return userData;
	}

	@Mutation(() => User)
	async refresh(
		@Context('req') request: Request,
		@Context('res') response: Response,
	) {
		const { refreshToken } = request.cookies;
		const userData = await this.authService.refresh(refreshToken);
		response.cookie('refreshToken', userData.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		return userData;
	}

	@Mutation(() => Boolean, { nullable: true })
	async logout(
		@Context('req') request: Request,
		@Context('res') response: Response,
	) {
		const { refreshToken } = request.cookies;
		await this.authService.logout(refreshToken);
		response.clearCookie('refreshToken');
	}
}
