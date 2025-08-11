import { INestApplication, Logger } from '@nestjs/common';

export function setupLogger(app: INestApplication) {
  // Simple console logger; replace with pino/winston if preferred
  app.useLogger(new Logger());
}
