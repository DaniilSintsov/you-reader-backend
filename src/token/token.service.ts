import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Token, TokenDocument } from './models/token.model';
import { ITokenPayload } from 'src/shared/types';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		@InjectModel(Token.name)
		private readonly tokenModel: Model<TokenDocument>,
	) {}

	async generateTokens(payload: ITokenPayload) {
		const accessToken = await this.jwtService.signAsync(payload, {
			secret: this.configService.get('JWT_ACCESS_SECRET'),
			expiresIn: '30m',
		});
		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: this.configService.get('JWT_REFRESH_SECRET'),
			expiresIn: '30d',
		});
		return {
			accessToken,
			refreshToken,
		};
	}

	async verifyAccessToken(token: string): Promise<ITokenPayload | null> {
		try {
			return await this.jwtService.verifyAsync(token, {
				secret: this.configService.get('JWT_ACCESS_SECRET'),
			});
		} catch (e) {
			return null;
		}
	}

	async verifyRefreshToken(token: string): Promise<ITokenPayload | null> {
		try {
			return await this.jwtService.verifyAsync(token, {
				secret: this.configService.get('JWT_REFRESH_SECRET'),
			});
		} catch (e) {
			return null;
		}
	}

	async saveToken({
		userId,
		refreshToken,
	}: {
		userId: mongoose.Schema.Types.ObjectId;
		refreshToken: string;
	}) {
		const tokenData = await this.tokenModel.findOne({ user: userId });
		if (tokenData) {
			tokenData.token = refreshToken;
			return tokenData.save();
		}
		const token = new this.tokenModel({
			user: userId,
			token: refreshToken,
			expiresIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		});
		return await token.save();
	}

	async removeToken(refreshToken: string) {
		await this.tokenModel.deleteOne({ token: refreshToken });
	}

	async findToken(refreshToken: string) {
		return await this.tokenModel.findOne({ token: refreshToken });
	}
}
