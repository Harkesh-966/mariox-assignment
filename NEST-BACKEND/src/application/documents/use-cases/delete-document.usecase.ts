import { Inject, Injectable } from '@nestjs/common';
import { DOCUMENT_REPOSITORY, IDocumentRepository } from '@/domain/documents/repository/document.repository.interface';

@Injectable()
export class DeleteDocumentUseCase {
  constructor(@Inject(DOCUMENT_REPOSITORY) private readonly repo: IDocumentRepository) {}
  async execute(id: string) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
