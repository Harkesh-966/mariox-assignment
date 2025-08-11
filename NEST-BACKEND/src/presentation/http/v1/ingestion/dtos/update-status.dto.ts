import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { IngestionStatus } from '@/domain/ingestion/entities/ingestion.entity';

export class UpdateIngestionStatusDto {
  @IsOptional() @IsIn(['queued','running','completed','failed']) status?: IngestionStatus;
  @IsOptional() @IsNumber() progress?: number;
  @IsOptional() metadata?: Record<string, any>;
}
