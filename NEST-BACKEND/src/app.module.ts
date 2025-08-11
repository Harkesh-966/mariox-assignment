import { Module } from '@nestjs/common';
import { ConfigurationModule } from './infrastructure/config/configuration.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { HttpModuleV1 } from './presentation/http/http.module';

@Module({
  imports: [ConfigurationModule, InfrastructureModule, HttpModuleV1],
})
export class AppModule {}
