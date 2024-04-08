import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/user/models/user';
import { UserService } from 'src/user/user.service';
import { LoginInput } from './dto/input/login';
import { Response } from 'express';
import * as bcryptjs from 'bcryptjs';
import { SignupInput } from './dto/input/signup';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async validate({ id }): Promise<UserModel> {
		const user = await this.userService.getUser({ id });
		if (!user) {
			throw Error('Authenticate validation error');
		}
		return user;
	}

	async login(loginData: LoginInput, response: Response) {
		const user = await this.userService.getUserByEmail(loginData.email);
		if (!user) {
			throw Error('Email or password incorrect');
		}

		const valid = await bcryptjs.compare(loginData.password, user.password);
		if (!valid) {
			throw Error('Email or password incorrect');
		}

		const jwt = this.jwtService.sign({ id: user.id });
		response.cookie('token', jwt, { httpOnly: true });

		return user;
	}

	async signup(signupData: SignupInput, response: Response) {
		const userByEmail = await this.userService.getUserByEmail(
			signupData.email,
		);
		if (!!userByEmail) {
			throw Error('Email is already in use');
		}
		const password = await bcryptjs.hash(signupData.password, 10);

		const newUser = await this.userService.createUser({
			...signupData,
			password,
		});

		const jwt = this.jwtService.sign({ id: newUser.id });
		response.cookie('token', jwt, { httpOnly: true });

		return newUser;
	}
}
