import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GetUserArgs } from './dto/args/get-user';
import { GetUsersArgs } from './dto/args/get-users';
import { DeleteUserInput } from './dto/input/delete-user';
import { UpdateUserInput } from './dto/input/update-user';
import { UserModel } from './models/user';
import { SignupInput } from 'src/auth/dto/input/signup';

@Injectable()
export class UserService {
	private users: UserModel[] = [];

	public createUser(createUserData: SignupInput): UserModel {
		const user: UserModel = {
			id: uuidv4(),
			...createUserData,
		};
		this.users.push(user);
		return user;
	}

	public updateUser(updateUserData: UpdateUserInput): UserModel {
		const user = this.users.find((user) => user.id === updateUserData.id);
		Object.assign(user, updateUserData);
		return user;
	}

	public getUser(getUserArgs: GetUserArgs): UserModel {
		return this.users.find((user) => user.id === getUserArgs.id);
	}

	public getUserByEmail(email: string): UserModel | undefined {
		return this.users.find((user) => user.email === email);
	}

	public getUsers(getUsersArgs: GetUsersArgs): UserModel[] {
		return getUsersArgs.ids.map((id) => this.getUser({ id }));
	}

	public deleteUser(deleteUserData: DeleteUserInput): UserModel {
		const userIndex = this.users.findIndex(
			(user) => user.id === deleteUserData.id,
		);
		const user = this.users[userIndex];
		this.users.splice(userIndex);
		return user;
	}
}
