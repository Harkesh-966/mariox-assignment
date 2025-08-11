import { Module } from '@nestjs/common';
import { AuthController } from './v1/auth/auth.controller';
import { UsersController } from './v1/users/users.controller';
import { DocumentsController } from './v1/documents/documents.controller';
import { IngestionController } from './v1/ingestion/ingestion.controller';
import { RegisterUserUseCase } from '@/application/auth/use-cases/register-user.usecase';
import { LoginUserUseCase } from '@/application/auth/use-cases/login-user.usecase';
import { TokenService } from '@/application/auth/services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { AssignRoleUseCase } from '@/application/users/use-cases/assign-role.usecase';
import { ListUsersUseCase } from '@/application/users/use-cases/list-users.usecase';
import { CreateDocumentUseCase } from '@/application/documents/use-cases/create-document.usecase';
import { UpdateDocumentUseCase } from '@/application/documents/use-cases/update-document.usecase';
import { DeleteDocumentUseCase } from '@/application/documents/use-cases/delete-document.usecase';
import { ListDocsByOwnerUseCase } from '@/application/documents/use-cases/list-docs-by-owner.usecase';
import { TriggerIngestionUseCase } from '@/application/ingestion/use-cases/trigger-ingestion.usecase';
import { UpdateIngestionStatusUseCase } from '@/application/ingestion/use-cases/update-ingestion-status.usecase';
import { GetIngestionUseCase } from '@/application/ingestion/use-cases/get-ingestion.usecase';
import { ListIngestionsUseCase } from '@/application/ingestion/use-cases/list-ingestions.usecase';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';

@Module({
  imports: [
    InfrastructureModule, // <-- bring in DI tokens (USER_REPOSITORY, DOCUMENT_REPOSITORY, INGESTION_REPOSITORY)
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change-me',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController, UsersController, DocumentsController, IngestionController],
  providers: [
    TokenService, JwtStrategy,
    RegisterUserUseCase, LoginUserUseCase,
    AssignRoleUseCase, ListUsersUseCase,
    CreateDocumentUseCase, UpdateDocumentUseCase, DeleteDocumentUseCase, ListDocsByOwnerUseCase,
    TriggerIngestionUseCase, UpdateIngestionStatusUseCase, GetIngestionUseCase, ListIngestionsUseCase,
  ],
  exports: [],
})
export class HttpModuleV1 {}
