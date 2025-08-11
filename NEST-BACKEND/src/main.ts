import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { setupVersioning } from './bootstrap/setup-versioning';
import { setupGlobals } from './bootstrap/setup-globals';
import { setupLogger } from './bootstrap/setup-logger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	setupLogger(app);
	app.use(helmet());
	setupVersioning(app);
	setupGlobals(app);
	await app.listen(process.env.PORT || 3000);
	console.log(`API listening on http://localhost:${process.env.PORT || 3000}/v1`);
}
bootstrap();
