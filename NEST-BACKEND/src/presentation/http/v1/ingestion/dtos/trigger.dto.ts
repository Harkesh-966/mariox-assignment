import { IsNotEmpty, IsOptional } from 'class-validator';
export class TriggerIngestionDto {
  @IsNotEmpty() documentId: string;
  @IsOptional() metadata?: Record<string, any>;
}
