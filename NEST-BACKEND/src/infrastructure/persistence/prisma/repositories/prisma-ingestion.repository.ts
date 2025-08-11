import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IIngestionRepository } from '@/domain/ingestion/repository/ingestion.repository.interface';
import { IngestionJob, IngestionStatus } from '@/domain/ingestion/entities/ingestion.entity';

function toDomain(row: any): IngestionJob {
	return IngestionJob.fromPrimitives({
		id: row.id,
		documentId: row.documentId,
		status: row.status as IngestionStatus,
		progress: row.progress,
		metadata: row.metadata ?? {},
	});
}

@Injectable()
export class PrismaIngestionRepository implements IIngestionRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(job: Partial<IngestionJob>): Promise<IngestionJob> {
		const created = await this.prisma.ingestionJob.create({
			data: {
				documentId: job.documentId!,
				status: (job.status ?? 'queued') as string,
				progress: job.progress ?? 0,
				metadata: job.metadata ?? {},
			},
		});
		return toDomain(created);
	}

	async update(id: string, data: Partial<IngestionJob>): Promise<IngestionJob> {
		const updated = await this.prisma.ingestionJob.update({
			where: { id },
			data: {
				status: data.status as string | undefined,
				progress: data.progress,
				metadata: data.metadata as any,
			},
		});
		return toDomain(updated);
	}

	async findById(id: string): Promise<IngestionJob | null> {
		const row = await this.prisma.ingestionJob.findUnique({ where: { id } });
		return row ? toDomain(row) : null;
	}

	async list(): Promise<IngestionJob[]> {
		const rows = await this.prisma.ingestionJob.findMany({ orderBy: { createdAt: 'desc' } });
		return rows.map(toDomain);
	}
}
