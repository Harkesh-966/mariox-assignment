import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '@/domain/auth/repository/user.repository.interface';
import { DOCUMENT_REPOSITORY } from '@/domain/documents/repository/document.repository.interface';
import { INGESTION_REPOSITORY } from '@/domain/ingestion/repository/ingestion.repository.interface';
import { PrismaModule } from './persistence/prisma/prisma.module';
import { PrismaUserRepository } from './persistence/prisma/repositories/prisma-user.repository';
import { PrismaDocumentRepository } from './persistence/prisma/repositories/prisma-document.repository';
import { PrismaIngestionRepository } from './persistence/prisma/repositories/prisma-ingestion.repository';
import { LocalStorageService } from './storage/local-storage.service';

@Module({
	imports: [PrismaModule],
	providers: [
		{ provide: USER_REPOSITORY, useClass: PrismaUserRepository },
		{ provide: DOCUMENT_REPOSITORY, useClass: PrismaDocumentRepository },
		{ provide: INGESTION_REPOSITORY, useClass: PrismaIngestionRepository },
		LocalStorageService
	],
	exports: [USER_REPOSITORY, DOCUMENT_REPOSITORY, INGESTION_REPOSITORY, LocalStorageService],
})
export class InfrastructureModule { }
