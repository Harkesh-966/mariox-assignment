import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, IUserRepository } from '@/domain/auth/repository/user.repository.interface';

@Injectable()
export class ListUsersUseCase {
	constructor(@Inject(USER_REPOSITORY) private readonly repo: IUserRepository) { }
	async execute() {
		const list = await this.repo.list();
		return list.map(u => ({ id: u.id, name: u.name, email: u.email, roles: u.roles }));
	}
}
