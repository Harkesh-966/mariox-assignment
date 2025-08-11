import { Inject, Injectable } from '@nestjs/common';
import { DOCUMENT_REPOSITORY, IDocumentRepository } from '@/domain/documents/repository/document.repository.interface';

@Injectable()
export class CreateDocumentUseCase {
	constructor(@Inject(DOCUMENT_REPOSITORY) private readonly repo: IDocumentRepository) { }
	async execute(input: { ownerId: string; title: string; description?: string; url?: string }) {
		const d = await this.repo.create(input);
		return d;
	}
}
