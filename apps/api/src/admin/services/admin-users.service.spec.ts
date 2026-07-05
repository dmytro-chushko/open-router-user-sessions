/**
 * UNIT-ТЕСТ для AdminUsersService
 *
 * Фокус: guardrails (B4) — правила, які не можна зламати при рефакторингу.
 * Happy path (успішне видалення / зміна role) покривається integration/e2e.
 *
 * Запуск: pnpm --filter api test -- admin-users.service.spec.ts
 */
import type { Role, User } from '@generated/prisma/client';

import { ADMIN_USERS_ERROR_MESSAGES } from '@/admin/errors/admin-users-error-messages';
import type { AdminUserDetailRow } from '@/admin/repositories/admin-users.repository';
import type { AdminUsersRepository } from '@/admin/repositories/admin-users.repository';
import { AdminUsersService } from '@/admin/services/admin-users.service';
import type { AuditLogService } from '@/audit/audit-log.service';
import type { UserAvatarService } from '@/user/services/user-avatar.service';
import type { UsersService } from '@/user/services/users.service';

const fixedDate = new Date('2026-01-01T00:00:00.000Z');

function createAdminDetailRow(input: {
  id: string;
  role: Role;
  email?: string;
}): AdminUserDetailRow {
  return {
    id: input.id,
    email: input.email ?? `${input.role.toLowerCase()}@example.com`,
    name: 'Test User',
    avatar: null,
    role: input.role,
    emailVerifiedAt: fixedDate,
    createdAt: fixedDate,
    updatedAt: fixedDate,
    passwordHash: 'hashed',
    accounts: [],
    sessions: [],
  };
}

function createUser(input: { id: string; role: Role; email?: string }): User {
  return {
    id: input.id,
    email: input.email ?? `${input.role.toLowerCase()}@example.com`,
    name: 'Test User',
    avatar: null,
    role: input.role,
    passwordHash: 'hashed',
    emailVerifiedAt: fixedDate,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

describe('AdminUsersService (unit)', () => {
  const actorAdminId = 'actor-admin-id';
  const targetAdminId = 'target-admin-id';

  const mockFindDetailById = jest.fn();
  const mockCountAdmins = jest.fn();
  const mockUpdateRole = jest.fn();

  const mockAdminUsersRepository = {
    findDetailById: mockFindDetailById,
    countAdmins: mockCountAdmins,
    updateRole: mockUpdateRole,
  } as unknown as AdminUsersRepository;

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

  describe('deleteUser', () => {
    it('throws when admin tries to delete themselves', async () => {
      mockFindById.mockResolvedValue(
        createUser({ id: actorAdminId, role: 'ADMIN' }),
      );

      await expect(
        service.deleteUser({
          adminId: actorAdminId,
          targetUserId: actorAdminId,
        }),
      ).rejects.toMatchObject({
        message: ADMIN_USERS_ERROR_MESSAGES.CANNOT_DELETE_SELF,
      });

      expect(mockDeleteById).not.toHaveBeenCalled();
      expect(mockCleanupManagedAvatarForUser).not.toHaveBeenCalled();
      expect(mockRecord).not.toHaveBeenCalled();
    });

    it('throws when deleting the last administrator', async () => {
      mockFindById.mockResolvedValue(
        createUser({ id: targetAdminId, role: 'ADMIN' }),
      );
      mockCountAdmins.mockResolvedValue(1);

      await expect(
        service.deleteUser({
          adminId: actorAdminId,
          targetUserId: targetAdminId,
        }),
      ).rejects.toMatchObject({
        message: ADMIN_USERS_ERROR_MESSAGES.CANNOT_DELETE_LAST_ADMIN,
      });

      expect(mockCountAdmins).toHaveBeenCalledTimes(1);
      expect(mockDeleteById).not.toHaveBeenCalled();
      expect(mockCleanupManagedAvatarForUser).not.toHaveBeenCalled();
      expect(mockRecord).not.toHaveBeenCalled();
    });
  });

  describe('updateRole', () => {
    it('throws when admin tries to change their own role', async () => {
      mockFindDetailById.mockResolvedValue(
        createAdminDetailRow({ id: actorAdminId, role: 'ADMIN' }),
      );

      await expect(
        service.updateRole({
          adminId: actorAdminId,
          targetUserId: actorAdminId,
          newRole: 'USER',
        }),
      ).rejects.toMatchObject({
        message: ADMIN_USERS_ERROR_MESSAGES.CANNOT_CHANGE_OWN_ROLE,
      });

      expect(mockUpdateRole).not.toHaveBeenCalled();
      expect(mockCountAdmins).not.toHaveBeenCalled();
      expect(mockRecord).not.toHaveBeenCalled();
    });

    it('throws when demoting the last administrator', async () => {
      mockFindDetailById.mockResolvedValue(
        createAdminDetailRow({ id: targetAdminId, role: 'ADMIN' }),
      );
      mockCountAdmins.mockResolvedValue(1);

      await expect(
        service.updateRole({
          adminId: actorAdminId,
          targetUserId: targetAdminId,
          newRole: 'USER',
        }),
      ).rejects.toMatchObject({
        message: ADMIN_USERS_ERROR_MESSAGES.CANNOT_DEMOTE_LAST_ADMIN,
      });

      expect(mockCountAdmins).toHaveBeenCalledTimes(1);
      expect(mockUpdateRole).not.toHaveBeenCalled();
      expect(mockRecord).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('throws when user is not found', async () => {
      mockFindDetailById.mockResolvedValue(null);

      await expect(service.getById('missing-user-id')).rejects.toMatchObject({
        message: ADMIN_USERS_ERROR_MESSAGES.USER_NOT_FOUND,
      });

      expect(mockFindDetailById).toHaveBeenCalledWith('missing-user-id');
    });
  });
});
