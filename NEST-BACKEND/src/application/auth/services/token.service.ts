import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
	constructor(private readonly jwt: JwtService) { }
	sign(payload: Record<string, any>) {
		return this.jwt.sign(payload);
	}
}
