import { INestApplication, VersioningType } from '@nestjs/common';

export function setupVersioning(app: INestApplication) {
	app.enableVersioning({ type: VersioningType.URI });
}
