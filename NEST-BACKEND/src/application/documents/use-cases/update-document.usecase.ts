import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DOCUMENT_REPOSITORY, IDocumentRepository } from '@/domain/documents/repository/document.repository.interface';

@Injectable()
export class UpdateDocumentUseCase {
	constructor(@Inject(DOCUMENT_REPOSITORY) private readonly repo: IDocumentRepository) { }
	async execute(id: string, input: Partial<{ title: string; description?: string; url?: string }>) {
		const exists = await this.repo.findById(id);
		if (!exists) throw new NotFoundException('Document not found');
		return this.repo.update(id, input);
	}
}
