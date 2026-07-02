/**
 * UNIT-ТЕСТ для AdminUsersService
 *
 * Тут тестуємо бізнес-правило з B4:
 * admin не може видалити СЕБЕ через admin panel.
 *
 * Звідки змінні?
 * - service — екземпляр AdminUsersService з mock-залежностями в конструкторі.
 * - mockUsersService.findById — jest.fn(), підміняє справжній UsersService.
 * - inputAdminId / inputTargetUserId — тестові id; головне, що вони ОДНАКОВІ.
 *
 * Чому не Test.createTestingModule?
 * - Для навчання простіше передати mock-и напряму в new AdminUsersService(...).
 * - Пізніше можна перейти на Nest TestingModule — результат той самий.
 *
 * Запуск: pnpm --filter api test -- admin-users.service.spec.ts
 */
import type { User } from '@generated/prisma/client';

import { ADMIN_USERS_ERROR_MESSAGES } from '@/admin/errors/admin-users-error-messages';
import type { AdminUsersRepository } from '@/admin/repositories/admin-users.repository';
import { AdminUsersService } from '@/admin/services/admin-users.service';
import type { AuditLogService } from '@/audit/audit-log.service';
import type { UserAvatarService } from '@/user/services/user-avatar.service';
import type { UsersService } from '@/user/services/users.service';

describe('AdminUsersService (unit)', () => {
  const inputAdminId = 'admin-self-id';

  /** Mock-и залежностей — окремі jest.fn(), щоб expect(...) не тригерив unbound-method. */
  const mockAdminUsersRepository = {} as AdminUsersRepository;

  const mockRecord = jest.fn().mockResolvedValue(undefined);
  const mockAuditLogService = {
    record: mockRecord,
  } as unknown as AuditLogService;

  const mockFindById = jest.fn();
  const mockDeleteById = jest.fn();
  const mockUsersService = {
    findById: mockFindById,
    deleteById: mockDeleteById,
  } as unknown as UsersService;

  const mockCleanupManagedAvatarForUser = jest
    .fn()
    .mockResolvedValue(undefined);
  const mockUserAvatarService = {
    cleanupManagedAvatarForUser: mockCleanupManagedAvatarForUser,
  } as unknown as UserAvatarService;

  let service: AdminUsersService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new AdminUsersService(
      mockAdminUsersRepository,
      mockAuditLogService,
      mockUsersService,
      mockUserAvatarService,
    );
  });

  it('throws ForbiddenException when admin tries to delete themselves', async () => {
    // Arrange — usersService знаходить user у «БД» (mock)
    const targetUser: User = {
      id: inputAdminId,
      email: 'admin@example.com',
      name: 'Admin',
      avatar: null,
      role: 'ADMIN',
      passwordHash: 'hashed',
      emailVerifiedAt: new Date('2026-01-01T00:00:00.000Z'),
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    mockFindById.mockResolvedValue(targetUser);

    // Act + Assert — один виклик deleteUser; очікуємо ForbiddenException з нашим текстом
    await expect(
      service.deleteUser({
        adminId: inputAdminId,
        targetUserId: inputAdminId,
      }),
    ).rejects.toMatchObject({
      message: ADMIN_USERS_ERROR_MESSAGES.CANNOT_DELETE_SELF,
    });

    expect(mockDeleteById).not.toHaveBeenCalled();
    expect(mockCleanupManagedAvatarForUser).not.toHaveBeenCalled();
    expect(mockRecord).not.toHaveBeenCalled();
  });
});
