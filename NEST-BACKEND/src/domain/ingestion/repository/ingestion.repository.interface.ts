import { IngestionJob } from '../entities/ingestion.entity';

export interface IIngestionRepository {
	create(job: Partial<IngestionJob>): Promise<IngestionJob>;
	update(id: string, data: Partial<IngestionJob>): Promise<IngestionJob>;
	findById(id: string): Promise<IngestionJob | null>;
	list(): Promise<IngestionJob[]>;
}
export const INGESTION_REPOSITORY = Symbol('INGESTION_REPOSITORY');
