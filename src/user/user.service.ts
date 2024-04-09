import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './models/user.model';
import { SignupInput } from 'src/auth/dto/input/signup.input';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
	) {}

	async createUser(createUserData: SignupInput): Promise<User> {
		const newUser = new this.userModel(createUserData);
		return await newUser.save();
	}

	async findById(id: mongoose.Schema.Types.ObjectId): Promise<User> {
		return await this.userModel.findById(id);
	}

	async getUserByEmail(email: string): Promise<User> {
		return await this.userModel.findOne({ email });
	}
}
