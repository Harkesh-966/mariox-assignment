import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateDocumentUseCase } from '@/application/documents/use-cases/create-document.usecase';
import { UpdateDocumentUseCase } from '@/application/documents/use-cases/update-document.usecase';
import { DeleteDocumentUseCase } from '@/application/documents/use-cases/delete-document.usecase';
import { ListDocsByOwnerUseCase } from '@/application/documents/use-cases/list-docs-by-owner.usecase';
import { CreateDocumentDto } from './dtos/create-doc.dto';
import { UpdateDocumentDto } from './dtos/update-doc.dto';

@Controller({ path: 'documents', version: '1' })
@UseGuards(JwtAuthGuard)
export class DocumentsController {
	constructor(
		private readonly createDoc: CreateDocumentUseCase,
		private readonly updateDoc: UpdateDocumentUseCase,
		private readonly deleteDoc: DeleteDocumentUseCase,
		private readonly listByOwner: ListDocsByOwnerUseCase,
	) { }

	@Get()
	async myDocs(@Req() req: any) { return this.listByOwner.execute(req.user.userId); }

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
