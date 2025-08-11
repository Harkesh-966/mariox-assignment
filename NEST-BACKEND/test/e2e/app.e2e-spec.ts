import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/src/app.module';

describe('App e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/auth/register POST', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({ name: 'John', email: 'john@example.com', password: 'secret123' })
      .expect(201);
    expect(res.body.email).toBe('john@example.com');
  });
});
