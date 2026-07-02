/**
 * UNIT-ТЕСТ для AdminGuard
 *
 * Що таке unit-тест?
 * - Тестуємо ОДИН клас (AdminGuard) ізольовано.
 * - Залежності (AuditLogService) підміняємо mock-об'єктами — без PostgreSQL.
 *
 * Звідки беруться методи?
 * - describe / it / expect / jest.fn — з Jest (вже в apps/api/package.json).
 * - AdminGuard, ForbiddenException — з нашого production-коду.
 * - createMockExecutionContext — локальний helper нижче (Nest не дає готового).
 *
 * Запуск: pnpm --filter api test -- admin.guard.spec.ts
 */
import { AuditAction } from '@generated/prisma/client';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';

import { AdminGuard } from '@/admin/guards/admin.guard';
import type { AuditLogService } from '@/audit/audit-log.service';
import type { PublicUser } from '@/user/types/public-user';

/** Мінімальний mock AuditLogService — лише метод record, який guard реально викликає. */
function createMockAuditLogService(): Pick<AuditLogService, 'record'> & {
  record: jest.Mock;
} {
  return {
    record: jest.fn().mockResolvedValue(undefined),
  };
}

/**
 * Nest передає guard-у ExecutionContext, з якого можна дістати HTTP request.
 * У тестах ми будуємо спрощену підробку цього об'єкта.
 */
function createMockExecutionContext(
  request: Partial<Request>,
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: <T = Request>() => request as T,
      getResponse: () => ({}),
      getNext: () => jest.fn(),
    }),
    getClass: jest.fn(),
    getHandler: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  } as unknown as ExecutionContext;
}

function createPublicUser(role: PublicUser['role']): PublicUser {
  const now = new Date('2026-01-01T00:00:00.000Z');

  return {
    id: `user-${role.toLowerCase()}`,
    email: `${role.toLowerCase()}@example.com`,
    name: role === 'ADMIN' ? 'Admin User' : 'Regular User',
    avatar: null,
    role,
    emailVerifiedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

describe('AdminGuard (unit)', () => {
  let mockAuditLogService: ReturnType<typeof createMockAuditLogService>;
  let guard: AdminGuard;

  /**
   * beforeEach — Jest викликає це ПЕРЕД кожним it(...).
   * Тут створюємо «чистий» guard і свіжі mock-и, щоб тести не впливали один на одного.
   */
  beforeEach(() => {
    mockAuditLogService = createMockAuditLogService();
    guard = new AdminGuard(mockAuditLogService as unknown as AuditLogService);
  });

  it('returns true when request.user.role is ADMIN', async () => {
    // Arrange — підготовка даних і контексту запиту
    const adminUser = createPublicUser('ADMIN');
    const context = createMockExecutionContext({
      user: adminUser,
      path: '/api/admin/stats',
      method: 'GET',
      ip: '127.0.0.1',
      headers: { 'user-agent': 'jest-test' },
    });

    // Act — викликаємо те, що тестуємо
    const result = await guard.canActivate(context);

    // Assert — перевіряємо очікувану поведінку
    expect(result).toBe(true);
    expect(mockAuditLogService.record).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException for USER and writes ADMIN_ACCESS_DENIED audit', async () => {
    const regularUser = createPublicUser('USER');
    const context = createMockExecutionContext({
      user: regularUser,
      path: '/api/admin/users',
      method: 'GET',
      ip: '10.0.0.1',
      headers: { 'user-agent': 'jest-test-agent' },
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );

    expect(mockAuditLogService.record).toHaveBeenCalledTimes(1);
    expect(mockAuditLogService.record).toHaveBeenCalledWith({
      action: AuditAction.ADMIN_ACCESS_DENIED,
      actorId: regularUser.id,
      success: false,
      ipAddress: '10.0.0.1',
      userAgent: 'jest-test-agent',
      metadata: {
        path: '/api/admin/users',
        method: 'GET',
        role: 'USER',
      },
    });
  });
});
