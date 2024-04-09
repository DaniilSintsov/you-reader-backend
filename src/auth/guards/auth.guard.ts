import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly tokenService: TokenService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}

		const payload = await this.tokenService.verifyAccessToken(token);
		if (!payload) {
			throw new UnauthorizedException();
		}

		request.user = payload;
		return true;
	}

	private extractTokenFromHeader(request: Request): string | null {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : null;
	}
}
