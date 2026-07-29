/**
 * E2E / INTEGRATION тести для GET /api/admin/audit-logs
 *
 * Два рівні, як у admin.e2e-spec.ts:
 * 1) full AppModule — справжній SessionAuthGuard (без cookie = 401)
 * 2) AdminModule + middleware з req.user — AuditLogService підмінений mock-ом
 *
 * Запуск: pnpm --filter api test:e2e -- admin-audit-logs.e2e-spec.ts
 */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';

import {
  createAdminIntegrationApp,
  createFullAppE2eApp,
  createPublicUser,
} from './helpers/create-admin-e2e-app';

import { AuditLogService } from '@/audit/audit-log.service';
import type { AuditLogWithRelations } from '@/audit/types/audit-log-with-relations';

const AUDIT_LOGS_PATH = '/api/admin/audit-logs';
const createdAt = new Date('2026-06-01T10:00:00.000Z');

/** getHttpServer() повертає any; supertest очікує App — явне приведення типу. */
function requestApp(app: INestApplication) {
  return request(app.getHttpServer() as App);
}

/** AuditLogService підмінений на mock у createAdminIntegrationApp. */
function readListForAdminMock(app: INestApplication): jest.Mock {
  return app.get<AuditLogService, { listForAdmin: jest.Mock }>(AuditLogService)
    .listForAdmin;
}

function createAuditLogRow(): AuditLogWithRelations {
  return {
    id: 'audit-log-id',
    action: 'USER_ROLE_CHANGED',
    actorId: 'admin-id',
    targetUserId: 'target-id',
    ipAddress: '127.0.0.1',
    userAgent: 'jest-e2e',
    success: true,
    metadata: { fromRole: 'USER', toRole: 'ADMIN' },
    createdAt,
    actor: { id: 'admin-id', email: 'admin@e2e.test', name: 'E2E Admin' },
    targetUser: { id: 'target-id', email: 'target@e2e.test', name: 'Target' },
  };
}

describe('Admin audit logs API (e2e / integration)', () => {
  describe('GET /api/admin/audit-logs — full AppModule (real SessionAuthGuard)', () => {
    let app: INestApplication;

    beforeEach(async () => {
      app = await createFullAppE2eApp();
    });

    afterEach(async () => {
      await app.close();
    });

    it('returns 401 when session cookie is missing', async () => {
      await requestApp(app).get(AUDIT_LOGS_PATH).expect(401);
    });
  });

  describe('GET /api/admin/audit-logs — AdminModule integration (simulated req.user)', () => {
    let app: INestApplication;

    afterEach(async () => {
      if (app !== undefined) {
        await app.close();
      }
    });

    it('returns 403 when req.user.role is USER', async () => {
      app = await createAdminIntegrationApp({ user: createPublicUser('USER') });

      await requestApp(app).get(AUDIT_LOGS_PATH).expect(403);
      expect(readListForAdminMock(app)).not.toHaveBeenCalled();
    });

    it('returns 200 with the paginated payload when req.user.role is ADMIN', async () => {
      app = await createAdminIntegrationApp({
        user: createPublicUser('ADMIN'),
      });
      readListForAdminMock(app).mockResolvedValue({
        items: [createAuditLogRow()],
        total: 1,
        page: 1,
        pageSize: 20,
      });

      const response = await requestApp(app).get(AUDIT_LOGS_PATH).expect(200);

      expect(response.body).toEqual({
        items: [
          {
            id: 'audit-log-id',
            action: 'USER_ROLE_CHANGED',
            actorId: 'admin-id',
            targetUserId: 'target-id',
            ipAddress: '127.0.0.1',
            userAgent: 'jest-e2e',
            success: true,
            metadata: { fromRole: 'USER', toRole: 'ADMIN' },
            createdAt: createdAt.toISOString(),
            actor: {
              id: 'admin-id',
              email: 'admin@e2e.test',
              name: 'E2E Admin',
            },
            targetUser: {
              id: 'target-id',
              email: 'target@e2e.test',
              name: 'Target',
            },
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
      });
    });

    it('applies query defaults when no filters are provided', async () => {
      app = await createAdminIntegrationApp({
        user: createPublicUser('ADMIN'),
      });
      const listForAdmin = readListForAdminMock(app);
      listForAdmin.mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 20,
      });

      await requestApp(app).get(AUDIT_LOGS_PATH).expect(200);

      expect(listForAdmin).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          pageSize: 20,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }),
      );
    });

    it('forwards action, date range and sorting to the service', async () => {
      app = await createAdminIntegrationApp({
        user: createPublicUser('ADMIN'),
      });
      const listForAdmin = readListForAdminMock(app);
      listForAdmin.mockResolvedValue({
        items: [],
        total: 0,
        page: 2,
        pageSize: 5,
      });

      await requestApp(app)
        .get(AUDIT_LOGS_PATH)
        .query({
          page: 2,
          pageSize: 5,
          action: 'LOGIN_FAILED',
          from: '2026-01-01T00:00:00.000Z',
          to: '2026-01-31T23:59:59.999Z',
          sortBy: 'action',
          sortOrder: 'asc',
        })
        .expect(200);

      expect(listForAdmin).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          pageSize: 5,
          action: 'LOGIN_FAILED',
          from: new Date('2026-01-01T00:00:00.000Z'),
          to: new Date('2026-01-31T23:59:59.999Z'),
          sortBy: 'action',
          sortOrder: 'asc',
        }),
      );
    });

    it('returns 400 for an unsupported sortBy value', async () => {
      app = await createAdminIntegrationApp({
        user: createPublicUser('ADMIN'),
      });

      await requestApp(app)
        .get(AUDIT_LOGS_PATH)
        .query({ sortBy: 'ipAddress' })
        .expect(400);
      expect(readListForAdminMock(app)).not.toHaveBeenCalled();
    });
  });
});
