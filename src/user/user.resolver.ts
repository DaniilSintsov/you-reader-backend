import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from './models/user';
import { UserService } from './user.service';
import { GetUserArgs } from './dto/args/get-user';
import { GetUsersArgs } from './dto/args/get-users';
import { UpdateUserInput } from './dto/input/update-user';
import { DeleteUserInput } from './dto/input/delete-user';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth';

@Resolver(() => UserModel)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => UserModel, { name: 'user', nullable: true })
	@UseGuards(GqlAuthGuard)
	getUser(@Args() getUserArgs: GetUserArgs) {
		return this.userService.getUser(getUserArgs);
	}

	@Query(() => [UserModel], { name: 'users', nullable: 'items' })
	getUsers(@Args() getUsersArgs: GetUsersArgs) {
		return this.userService.getUsers(getUsersArgs);
	}

	@Mutation(() => UserModel)
	updateUser(
		@Args('updateUserData') updateUserData: UpdateUserInput,
	): UserModel {
		return this.userService.updateUser(updateUserData);
	}

	@Mutation(() => UserModel)
	deleteUser(
		@Args('deleteUserData') deleteUserData: DeleteUserInput,
	): UserModel {
		return this.userService.deleteUser(deleteUserData);
	}
}
