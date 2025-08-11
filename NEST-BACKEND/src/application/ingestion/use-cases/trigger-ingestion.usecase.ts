import { Inject, Injectable } from '@nestjs/common';
import { INGESTION_REPOSITORY, IIngestionRepository } from '@/domain/ingestion/repository/ingestion.repository.interface';

@Injectable()
export class TriggerIngestionUseCase {
	constructor(@Inject(INGESTION_REPOSITORY) private readonly repo: IIngestionRepository) { }

	async execute(input: { documentId: string; metadata?: any }) {
		const job = await this.repo.create({ documentId: input.documentId, metadata: input.metadata ?? {} });
		return job;
	}
}
