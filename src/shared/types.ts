import mongoose from 'mongoose';

export interface ITokenPayload {
	userId: mongoose.Schema.Types.ObjectId;
	email: string;
}

export interface ICreateBookData {
	_id: mongoose.Types.ObjectId;
	user: mongoose.Schema.Types.ObjectId;
	title: string;
	author?: string;
	cover: string;
	file: string;
	isFavorite: boolean;
	pagesCount: number;
	currentPage: number;
}
