import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IUserRepository } from '@/domain/auth/repository/user.repository.interface';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
	constructor(private readonly prisma: PrismaService) { }

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } });
	}
	async findById(id: string) {
		return this.prisma.user.findUnique({ where: { id } });
	}
	async list() {
		return this.prisma.user.findMany();
	}
	async create(data: any) {
		const { name, email, passwordHash, roles = ['viewer'] } = data;
		return this.prisma.user.create({ data: { name, email, passwordHash, roles } });
	}
	async update(id: string, data: any) {
		return this.prisma.user.update({ where: { id }, data });
	}
}
