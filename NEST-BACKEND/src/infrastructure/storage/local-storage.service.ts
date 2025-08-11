import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStorageService {
    private readonly uploadDir: string;
    
    constructor(private readonly config: ConfigService) {
        this.uploadDir = this.config.get<string>('UPLOAD_DIR') ?? 'uploads';
    }
    async init() {
        await fs.mkdir(this.uploadDir, { recursive: true });
    }
    async save(buffer: Buffer, originalName: string): Promise<{ storagePath: string }> {
        await this.init();
        const ext = path.extname(originalName || '');
        const fileName = `${randomUUID()}${ext || ''}`;
        const storagePath = path.join(this.uploadDir, fileName);
        await fs.writeFile(storagePath, buffer);
        return { storagePath };
    }
}
