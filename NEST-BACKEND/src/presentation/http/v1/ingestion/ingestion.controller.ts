import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TriggerIngestionUseCase } from '@/application/ingestion/use-cases/trigger-ingestion.usecase';
import { UpdateIngestionStatusUseCase } from '@/application/ingestion/use-cases/update-ingestion-status.usecase';
import { GetIngestionUseCase } from '@/application/ingestion/use-cases/get-ingestion.usecase';
import { ListIngestionsUseCase } from '@/application/ingestion/use-cases/list-ingestions.usecase';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { TriggerIngestionDto } from './dtos/trigger.dto';
import { UpdateIngestionStatusDto } from './dtos/update-status.dto';

@Controller({ path: 'ingestion', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
  constructor(
    private readonly trigger: TriggerIngestionUseCase,
    private readonly updateStatus: UpdateIngestionStatusUseCase,
    private readonly get: GetIngestionUseCase,
    private readonly list: ListIngestionsUseCase,
  ) {}

  @Post('trigger')
  @Roles('editor','admin')
  async triggerIngestion(@Body() dto: TriggerIngestionDto) { return this.trigger.execute(dto); }

  @Patch(':id/status')
  @Roles('admin')
  async setStatus(@Param('id') id: string, @Body() dto: UpdateIngestionStatusDto) { return this.updateStatus.execute(id, dto); }

  @Get(':id')
  async getOne(@Param('id') id: string) { return this.get.execute(id); }

  @Get()
  @Roles('admin')
  async all() { return this.list.execute(); }
}
