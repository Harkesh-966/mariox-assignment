import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@/domain/auth/repository/user.repository.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
	private users: any[] = [];
	async findByEmail(email: string) { return this.users.find(u => u.email === email) ?? null; }
	async findById(id: string) { return this.users.find(u => u.id === id) ?? null; }
	async list() { return this.users; }
	async create(data: any) { const u = { id: randomUUID(), roles: ['viewer'], ...data }; this.users.push(u); return u; }
	async update(id: string, data: any) { const i = this.users.findIndex(u => u.id === id); if (i >= 0) this.users[i] = { ...this.users[i], ...data }; return this.users[i]; }
}
