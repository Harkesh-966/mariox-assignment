import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_REPOSITORY, IUserRepository } from '@/domain/auth/repository/user.repository.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RegisterUserUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly repo: IUserRepository) {}

  async execute(input: { name: string; email: string; password: string }) {
    const exists = await this.repo.findByEmail(input.email);
    if (exists) throw new UnauthorizedException('Email already in use');
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.repo.create({ name: input.name, email: input.email, passwordHash, roles: ['viewer'] });
    return { id: user.id, name: user.name, email: user.email, roles: user.roles };
  }
}
