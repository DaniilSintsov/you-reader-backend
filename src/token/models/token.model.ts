import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { User } from 'src/user/models/user.model';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token extends Document {
	@Prop({ required: true, ref: User.name })
	user: mongoose.Schema.Types.ObjectId;

	@Prop({ required: true })
	token: string;

	@Prop({ required: true })
	expiresIn: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
