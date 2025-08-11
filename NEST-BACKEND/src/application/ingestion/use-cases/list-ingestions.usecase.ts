import { Inject, Injectable } from '@nestjs/common';
import { INGESTION_REPOSITORY, IIngestionRepository } from '@/domain/ingestion/repository/ingestion.repository.interface';

@Injectable()
export class ListIngestionsUseCase {
  constructor(@Inject(INGESTION_REPOSITORY) private readonly repo: IIngestionRepository) {}
  async execute() { return this.repo.list(); }
}
