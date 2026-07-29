/**
 * UNIT-ТЕСТ для AuditLogRepository
 *
 * Фокус: findManyPaginated мапить sortBy/sortOrder у Prisma `orderBy`
 * і не втрачає where-фільтри. PrismaService підмінений mock-ом — без PostgreSQL.
 *
 * Запуск: pnpm --filter api test -- audit-log.repository.spec.ts
 */
import { AuditLogRepository } from '@/audit/repositories/audit-log.repository';
import type { AuditLogListQuery } from '@/audit/types/audit-log-list-query';
import type { PrismaService } from '@/prisma/prisma.service';

function createMockPrismaService(): {
  prisma: PrismaService;
  findMany: jest.Mock;
  count: jest.Mock;
} {
  const findMany = jest.fn().mockResolvedValue([]);
  const count = jest.fn().mockResolvedValue(0);

  return {
    prisma: { auditLog: { findMany, count } } as unknown as PrismaService,
    findMany,
    count,
  };
}

function createQuery(
  overrides: Partial<AuditLogListQuery> = {},
): AuditLogListQuery {
  return {
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...overrides,
  };
}

describe('AuditLogRepository.findManyPaginated (unit)', () => {
  it('orders by createdAt desc by default', async () => {
    const { prisma, findMany } = createMockPrismaService();
    const repository = new AuditLogRepository(prisma);

    await repository.findManyPaginated(createQuery());

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      }),
    );
  });

  it('maps sortBy and sortOrder into Prisma orderBy', async () => {
    const { prisma, findMany } = createMockPrismaService();
    const repository = new AuditLogRepository(prisma);

    await repository.findManyPaginated(
      createQuery({
        page: 3,
        pageSize: 10,
        sortBy: 'action',
        sortOrder: 'asc',
      }),
    );

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { action: 'asc' },
        skip: 20,
        take: 10,
      }),
    );
  });

  it('keeps action and date filters in the where clause', async () => {
    const { prisma, findMany, count } = createMockPrismaService();
    const repository = new AuditLogRepository(prisma);
    const from = new Date('2026-01-01T00:00:00.000Z');
    const to = new Date('2026-01-31T23:59:59.999Z');

    await repository.findManyPaginated(
      createQuery({ action: 'LOGIN_FAILED', from, to }),
    );

    const expectedWhere = {
      action: 'LOGIN_FAILED',
      createdAt: { gte: from, lte: to },
    };

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expectedWhere }),
    );
    expect(count).toHaveBeenCalledWith({ where: expectedWhere });
  });
});
