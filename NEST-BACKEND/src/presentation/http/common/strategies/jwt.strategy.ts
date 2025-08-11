import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || 'change-me'
		});

		console.log("Check token", ExtractJwt.fromAuthHeaderAsBearerToken());
	}
	async validate(payload: any) {
		console.log("payload",payload);
		return { userId: payload.sub, roles: payload.roles ?? [] };
	}
}
