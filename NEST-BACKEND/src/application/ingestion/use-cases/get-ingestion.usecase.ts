import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INGESTION_REPOSITORY, IIngestionRepository } from '@/domain/ingestion/repository/ingestion.repository.interface';

@Injectable()
export class GetIngestionUseCase {
	constructor(@Inject(INGESTION_REPOSITORY) private readonly repo: IIngestionRepository) { }
	async execute(id: string) {
		const j = await this.repo.findById(id);
		if (!j) throw new NotFoundException('Ingestion not found');
		return j;
	}
}
