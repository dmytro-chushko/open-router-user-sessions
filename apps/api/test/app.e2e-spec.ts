import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from './../src/app.module';

describe('ApiContract (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/health (GET) liveness', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ ok: true });
  });

  it('/api/health/ready (GET) readiness', () => {
    return request(app.getHttpServer())
      .get('/api/health/ready')
      .expect((res) => {
        expect([200, 503]).toContain(res.status);
        expect(res.body).toHaveProperty('ok');
      });
  });

  it('/api/hello (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/hello')
      .expect(200)
      .expect({ message: 'Hello world' });
  });

  afterEach(async () => {
    await app.close();
  });
});
