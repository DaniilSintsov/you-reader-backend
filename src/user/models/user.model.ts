import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@ObjectType()
@Schema()
export class User extends Document {
	@Field(() => ID)
	_id: mongoose.Schema.Types.ObjectId;

	@Field(() => String)
	@Prop({ required: true })
	name: string;

	@Field(() => String)
	@Prop({ unique: true, required: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Field(() => String, { nullable: true })
	refreshToken: string;

	@Field(() => String, { nullable: true })
	accessToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
