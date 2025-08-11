import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateDocumentUseCase } from '@/application/documents/use-cases/create-document.usecase';
import { UpdateDocumentUseCase } from '@/application/documents/use-cases/update-document.usecase';
import { DeleteDocumentUseCase } from '@/application/documents/use-cases/delete-document.usecase';
import { ListDocsByOwnerUseCase } from '@/application/documents/use-cases/list-docs-by-owner.usecase';
import { CreateDocumentDto } from './dtos/create-doc.dto';
import { UpdateDocumentDto } from './dtos/update-doc.dto';
import { UploadAndIngestUseCase } from '@/application/documents/use-cases/upload-and-ingest.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAndIngestDto } from './dtos/upload-and-ingest.dto';

@Controller({ path: 'documents', version: '1' })
@UseGuards(JwtAuthGuard)
export class DocumentsController {
	constructor(
		private readonly createDoc: CreateDocumentUseCase,
		private readonly updateDoc: UpdateDocumentUseCase,
		private readonly deleteDoc: DeleteDocumentUseCase,
		private readonly listDocs: ListDocsByOwnerUseCase,
		private readonly uploadAndIngest: UploadAndIngestUseCase
	) { }

	@Get()
	async myDocs(@Req() req: any) { return this.listDocs.execute(req.user.userId); }

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async upload(
		@Req() req: any,
		@UploadedFile() file: Express.Multer.File | undefined,
		@Body() body: UploadAndIngestDto,
	) {
		let meta: any = body.metadata;
		if (typeof meta === 'string' && meta.trim()) {
			try { meta = JSON.parse(meta); } catch {
				throw new BadRequestException('metadata must be valid JSON');
			}
		}

		return this.uploadAndIngest.execute({
			ownerId: req.user.userId,
			file,
			title: body.title,
			description: body.description,
			ingestNow: !!body.ingestNow,
			paused: !!body.paused,
			metadata: meta,
		});
	}

	@Post()
	async create(@Req() req: any, @Body() dto: CreateDocumentDto) {
		return this.createDoc.execute({ ownerId: req.user.userId, ...dto });
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
		return this.updateDoc.execute(id, dto);
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.deleteDoc.execute(id);
	}

}
