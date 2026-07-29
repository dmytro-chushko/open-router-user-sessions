/**
 * UNIT-ТЕСТ для AuditLogService.listForAdmin
 *
 * Фокус: нормалізація пагінації та сортування перед викликом репозиторію.
 * AuditLogRepository підмінений mock-ом — без PostgreSQL.
 *
 * Запуск: pnpm --filter api test -- audit-log.service.spec.ts
 */
import { AuditLogService } from '@/audit/audit-log.service';
import type { AuditLogRepository } from '@/audit/repositories';

describe('AuditLogService.listForAdmin (unit)', () => {
  const mockFindManyPaginated = jest
    .fn()
    .mockResolvedValue({ items: [], total: 0 });
  const mockAuditLogRepository = {
    findManyPaginated: mockFindManyPaginated,
  } as unknown as AuditLogRepository;

  let service: AuditLogService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFindManyPaginated.mockResolvedValue({ items: [], total: 0 });

    service = new AuditLogService(mockAuditLogRepository);
  });

  it('applies default sorting when input omits it', async () => {
    await service.listForAdmin();

    expect(mockFindManyPaginated).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        pageSize: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    );
  });

  it('forwards requested sorting and filters', async () => {
    const from = new Date('2026-01-01T00:00:00.000Z');

    const result = await service.listForAdmin({
      page: 2,
      pageSize: 5,
      action: 'LOGIN_FAILED',
      from,
      sortBy: 'action',
      sortOrder: 'asc',
    });

    expect(mockFindManyPaginated).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
        pageSize: 5,
        action: 'LOGIN_FAILED',
        from,
        sortBy: 'action',
        sortOrder: 'asc',
      }),
    );
    expect(result).toEqual({ items: [], total: 0, page: 2, pageSize: 5 });
  });

  it('clamps pageSize to the maximum allowed value', async () => {
    await service.listForAdmin({ pageSize: 500 });

    expect(mockFindManyPaginated).toHaveBeenCalledWith(
      expect.objectContaining({ pageSize: 100 }),
    );
  });
});
