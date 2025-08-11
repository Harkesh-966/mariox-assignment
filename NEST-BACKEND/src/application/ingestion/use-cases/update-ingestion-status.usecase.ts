import { Inject, Injectable } from '@nestjs/common';
import { INGESTION_REPOSITORY, IIngestionRepository } from '@/domain/ingestion/repository/ingestion.repository.interface';
import { IngestionStatus } from '@/domain/ingestion/entities/ingestion.entity';

@Injectable()
export class UpdateIngestionStatusUseCase {
	constructor(@Inject(INGESTION_REPOSITORY) private readonly repo: IIngestionRepository) { }
	async execute(id: string, input: { status?: IngestionStatus; progress?: number; metadata?: any }) {
		return this.repo.update(id, input);
	}
}
