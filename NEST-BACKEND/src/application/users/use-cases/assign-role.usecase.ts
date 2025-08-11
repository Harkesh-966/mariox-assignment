import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, IUserRepository } from '@/domain/auth/repository/user.repository.interface';

@Injectable()
export class AssignRoleUseCase {
	constructor(@Inject(USER_REPOSITORY) private readonly repo: IUserRepository) { }

	async execute(input: { userId: string; role: string }) {
		const u = await this.repo.findById(input.userId);
		if (!u) throw new NotFoundException('User not found');
		const roles = Array.from(new Set([...(u.roles ?? []), input.role]));
		const updated = await this.repo.update(u.id, { roles });
		return { id: updated.id, roles: updated.roles };
	}
}
