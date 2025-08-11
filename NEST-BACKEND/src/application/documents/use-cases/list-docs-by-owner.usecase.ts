import { Inject, Injectable } from '@nestjs/common';
import { DOCUMENT_REPOSITORY, IDocumentRepository } from '@/domain/documents/repository/document.repository.interface';

@Injectable()
export class ListDocsByOwnerUseCase {
  constructor(@Inject(DOCUMENT_REPOSITORY) private readonly repo: IDocumentRepository) {}
  async execute(ownerId: string) { return this.repo.listByOwner(ownerId); }
}
