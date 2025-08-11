import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_REPOSITORY, IUserRepository } from '@/domain/auth/repository/user.repository.interface';
import * as bcrypt from 'bcryptjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly repo: IUserRepository,
    private readonly tokens: TokenService,
  ) {}

  async execute(input: { email: string; password: string }) {
    const user = await this.repo.findByEmail(input.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const accessToken = this.tokens.sign({ sub: user.id, roles: user.roles });
    return { accessToken };
  }
}
