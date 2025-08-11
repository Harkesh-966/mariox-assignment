import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IDocumentRepository } from '@/domain/documents/repository/document.repository.interface';

@Injectable()
export class PrismaDocumentRepository implements IDocumentRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: any) {
		const { ownerId, title, description, url } = data;
		return this.prisma.document.create({ data: { ownerId, title, description, url } });
	}

	async update(id: string, data: any) {
		return this.prisma.document.update({ where: { id }, data });
	}

	async delete(id: string) {
		await this.prisma.document.delete({ where: { id } });
	}

	async findById(id: string) {
		return this.prisma.document.findUnique({ where: { id } });
	}

	async listByOwner(ownerId: string) {
		return this.prisma.document.findMany({ where: { ownerId }, orderBy: { createdAt: 'desc' } });
	}
}
