import { Injectable } from '@nestjs/common';
import { IDocumentRepository } from '@/domain/documents/repository/document.repository.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemoryDocumentRepository implements IDocumentRepository {
	private docs: any[] = [];
	async create(data: any) { const d = { id: randomUUID(), createdAt: new Date().toISOString(), ...data }; this.docs.push(d); return d; }
	async update(id: string, data: any) { const i = this.docs.findIndex(d => d.id === id); if (i >= 0) this.docs[i] = { ...this.docs[i], ...data }; return this.docs[i]; }
	async delete(id: string) { this.docs = this.docs.filter(d => d.id !== id); }
	async findById(id: string) { return this.docs.find(d => d.id === id) ?? null; }
	async listByOwner(ownerId: string) { return this.docs.filter(d => d.ownerId === ownerId); }
}
