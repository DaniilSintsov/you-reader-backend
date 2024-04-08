import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserModel } from 'src/user/models/user';
import { LoginInput } from './dto/input/login';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/input/signup';
import { Response } from 'express';

@Resolver(() => UserModel)
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => UserModel)
	async login(
		@Args('loginData') loginData: LoginInput,
		@Context('res') response: Response,
	) {
		return await this.authService.login(loginData, response);
	}

	@Mutation(() => UserModel)
	async signup(
		@Args('signupData') signupData: SignupInput,
		@Context('res') response: Response,
	) {
		return await this.authService.signup(signupData, response);
	}
}
