/**
 * Helpers для admin HTTP-тестів.
 *
 * 1) createFullAppE2eApp()
 *    - Повний AppModule + справжній SessionAuthGuard → без cookie = 401.
 *
 * 2) createAdminIntegrationApp({ user })
 *    - Лише admin-шар (ConfigModule + AdminModule), без SessionAuthGuard.
 *    - Express middleware кладе req.user — симуляція «вже залогінений».
 *    - AdminStatsService і AuditLogService підмінені — тест не потребує PostgreSQL.
 */
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';

import { AdminModule } from '@/admin/admin.module';
import { AdminStatsService } from '@/admin/services/admin-stats.service';
import type { AdminStatsOverview } from '@/admin/types/admin-stats-overview';
import { AppModule } from '@/app.module';
import { AuditLogService } from '@/audit/audit-log.service';
import { CommonModule } from '@/common/common.module';
import type { PublicUser } from '@/user/types/public-user';

const defaultStatsOverview: AdminStatsOverview = {
  totalUsers: 10,
  newUsersLast7Days: 2,
  unverifiedUsers: 1,
  adminCount: 1,
  oauthOnlyUsers: 3,
  newUsersSince: '2026-01-01T00:00:00.000Z',
  generatedAt: '2026-06-01T00:00:00.000Z',
};

export async function createFullAppE2eApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  await app.init();

  return app;
}

export async function createAdminIntegrationApp(input: {
  user: PublicUser;
  statsOverview?: AdminStatsOverview;
}): Promise<INestApplication> {
  const statsOverview = input.statsOverview ?? defaultStatsOverview;

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      CommonModule,
      AdminModule,
    ],
  })
    .overrideProvider(AdminStatsService)
    .useValue({
      getOverview: jest.fn().mockResolvedValue(statsOverview),
    })
    .overrideProvider(AuditLogService)
    .useValue({
      record: jest.fn().mockResolvedValue(undefined),
      listForAdmin: jest.fn(),
      listForUser: jest.fn(),
    })
    .compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const sessionUser = input.user;
  app.use((req: Request, _res: Response, next: NextFunction) => {
    req.user = sessionUser;
    next();
  });

  await app.init();

  return app;
}

export function createPublicUser(role: PublicUser['role']): PublicUser {
  const now = new Date('2026-01-01T00:00:00.000Z');

  return {
    id: `e2e-${role.toLowerCase()}-id`,
    email: `${role.toLowerCase()}@e2e.test`,
    name: role === 'ADMIN' ? 'E2E Admin' : 'E2E User',
    avatar: null,
    role,
    emailVerifiedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}
