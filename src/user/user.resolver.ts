import { Context, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ITokenPayload } from 'src/shared/types';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@UseGuards(AuthGuard)
	@Query(() => User)
	async getUser(@Context('req') request: Request) {
		return await this.userService.findById(
			(request['user'] as ITokenPayload).userId,
		);
	}
}
