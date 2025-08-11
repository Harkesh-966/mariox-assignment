import { INestApplication, ValidationPipe } from '@nestjs/common';

export function setupGlobals(app: INestApplication) {
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}
