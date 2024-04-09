import mongoose from 'mongoose';

export interface ITokenPayload {
	userId: mongoose.Schema.Types.ObjectId;
	email: string;
}
