import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
	@Field()
	@IsNotEmpty()
	name: string;

	@Field()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@Field()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(20)
	password: string;
}
