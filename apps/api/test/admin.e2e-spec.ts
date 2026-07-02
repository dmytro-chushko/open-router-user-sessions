/**
 * E2E / INTEGRATION тести для admin API (GET /api/admin/stats)
 *
 * Два describe-блоки = два рівні тестування:
 *
 * 1) full AppModule — справжній SessionAuthGuard (e2e)
 * 2) AdminModule + middleware — без auth module (integration)
 *
 * Запуск: pnpm --filter api test:e2e -- admin.e2e-spec.ts
 */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';

import {
  createAdminIntegrationApp,
  createFullAppE2eApp,
  createPublicUser,
} from './helpers/create-admin-e2e-app';

/** getHttpServer() повертає any; supertest очікує App — явне приведення типу. */
function requestApp(app: INestApplication) {
  return request(app.getHttpServer() as App);
}

describe('Admin API (e2e / integration)', () => {
  describe('GET /api/admin/stats — full AppModule (real SessionAuthGuard)', () => {
    let app: INestApplication;

    beforeEach(async () => {
      app = await createFullAppE2eApp();
    });

    afterEach(async () => {
      await app.close();
    });

    it('returns 401 when session cookie is missing', async () => {
      await requestApp(app).get('/api/admin/stats').expect(401);
    });
  });

  describe('GET /api/admin/stats — AdminModule integration (simulated req.user)', () => {
    let app: INestApplication;

    afterEach(async () => {
      if (app !== undefined) {
        await app.close();
      }
    });

    it('returns 403 when req.user.role is USER', async () => {
      app = await createAdminIntegrationApp({
        user: createPublicUser('USER'),
      });

      await requestApp(app).get('/api/admin/stats').expect(403);
    });

    it('returns 200 with overview payload when req.user.role is ADMIN', async () => {
      app = await createAdminIntegrationApp({
        user: createPublicUser('ADMIN'),
      });

      const response = await requestApp(app)
        .get('/api/admin/stats')
        .expect(200);

      expect(response.body).toEqual({
        totalUsers: 10,
        newUsersLast7Days: 2,
        unverifiedUsers: 1,
        adminCount: 1,
        oauthOnlyUsers: 3,
        newUsersSince: '2026-01-01T00:00:00.000Z',
        generatedAt: '2026-06-01T00:00:00.000Z',
      });
    });
  });
});
