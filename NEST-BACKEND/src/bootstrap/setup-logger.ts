import { INestApplication, Logger } from '@nestjs/common';

export function setupLogger(app: INestApplication) {
	app.useLogger(new Logger());
}
