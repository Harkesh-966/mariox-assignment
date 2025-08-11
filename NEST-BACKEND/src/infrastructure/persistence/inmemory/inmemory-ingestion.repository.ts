import { Injectable } from '@nestjs/common';
import { IIngestionRepository } from '@/domain/ingestion/repository/ingestion.repository.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemoryIngestionRepository implements IIngestionRepository {
  private jobs: any[] = [];
  async create(job: any) { const j = { id: randomUUID(), status: 'queued', progress: 0, ...job }; this.jobs.push(j); return j; }
  async update(id: string, data: any) { const i = this.jobs.findIndex(j => j.id === id); if (i>=0) this.jobs[i] = { ...this.jobs[i], ...data }; return this.jobs[i]; }
  async findById(id: string) { return this.jobs.find(j => j.id === id) ?? null; }
  async list() { return this.jobs; }
}
