import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { User } from 'src/user/models/user.model';

export type BookDocument = HydratedDocument<Book>;

@ObjectType()
@Schema()
export class Book extends Document {
	@Field(() => ID)
	_id: mongoose.Schema.Types.ObjectId;

	@Prop({ required: true, ref: User.name })
	user: mongoose.Schema.Types.ObjectId;

	@Field(() => String)
	@Prop({ required: true })
	title: string;

	@Field(() => String, { nullable: true })
	@Prop()
	author?: string;

	@Field(() => String)
	@Prop({ required: true })
	cover: string;

	@Field(() => String)
	@Prop({ required: true })
	file: string;

	@Field(() => Boolean)
	@Prop({ required: true })
	isFavorite: boolean;

	@Field(() => Int)
	@Prop({ required: true })
	pagesCount: number;

	@Field(() => Int)
	@Prop({ required: true })
	currentPage: number;

	@Field(() => Float, { nullable: true })
	@Prop({ required: true })
	heightToWidthRatio: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
