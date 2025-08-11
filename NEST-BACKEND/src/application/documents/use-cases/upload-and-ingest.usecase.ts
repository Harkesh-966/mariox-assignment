import { Inject, Injectable } from '@nestjs/common';
import { DOCUMENT_REPOSITORY, IDocumentRepository } from '@/domain/documents/repository/document.repository.interface';
import { INGESTION_REPOSITORY, IIngestionRepository } from '@/domain/ingestion/repository/ingestion.repository.interface';
import { LocalStorageService } from '@/infrastructure/storage/local-storage.service';

@Injectable()
export class UploadAndIngestUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY) private readonly docs: IDocumentRepository,
    @Inject(INGESTION_REPOSITORY) private readonly ingestions: IIngestionRepository,
    private readonly storage: LocalStorageService,
  ) {}

  async execute(input: {
    ownerId: string;
    file?: Express.Multer.File;
    title: string;
    description?: string;
    ingestNow?: boolean;
    paused?: boolean;
    metadata?: any;
  }) {
    let storagePath: string | undefined;
    let originalName: string | undefined;
    let mimeType: string | undefined;
    let size: number | undefined;

    if (input.file) {
      const saved = await this.storage.save(input.file.buffer, input.file.originalname || 'file');
      storagePath = saved.storagePath;
      originalName = input.file.originalname;
      mimeType = input.file.mimetype;
      size = input.file.size;
    }

    const document = await this.docs.create({
      ownerId: input.ownerId,
      title: input.title,
      description: input.description,
      url: undefined, // you can compute a CDN/public URL later if needed
      storagePath,
      originalName,
      mimeType,
      size,
    });

    let job: any = null;
    if (input.ingestNow) {
      job = await this.ingestions.create({
        documentId: document.id,
        status: 'queued',
        progress: 0,
        metadata: input.metadata ?? {},
        paused: !!input.paused,
        triggeredById: input.ownerId,
      });
    }

    return { document, ingestionJob: job };
  }
}
