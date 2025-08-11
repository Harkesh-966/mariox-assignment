import { ToBoolean } from '@/presentation/http/common/decorators/to-boolean.decorator';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
export class UploadAndIngestDto {
  @IsNotEmpty() title: string;
  @IsOptional() description?: string;

  @IsOptional() @ToBoolean() @IsBoolean() ingestNow?: boolean;
  @IsOptional() @ToBoolean() @IsBoolean() paused?: boolean; // create job paused
  @IsOptional() metadata?: any; // send as JSON string in multipart, we will parse in controller
}
