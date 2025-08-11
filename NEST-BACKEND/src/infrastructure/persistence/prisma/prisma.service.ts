import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

function buildPostgresUrl() {
  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ?? '5432';
  const user = process.env.DB_USER ?? 'postgres';
  const pass = encodeURIComponent(process.env.DB_PASSWORD ?? 'postgres');
  const db   = process.env.DB_NAME ?? 'nestjs_app';
  const schema = process.env.DB_SCHEMA ?? 'public';
  const ssl = (process.env.DB_SSL ?? 'false').toLowerCase() === 'true';
  const sslParam = ssl ? '?sslmode=require' : '';
  const searchPath = schema ? (sslParam ? `&schema=${schema}` : `?schema=${schema}`) : '';
  return `postgresql://${user}:${pass}@${host}:${port}/${db}${sslParam}${searchPath}`;
}

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: { db: { url: buildPostgresUrl() } },
    });
  }
}
