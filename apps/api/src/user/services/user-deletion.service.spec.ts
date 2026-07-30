/**
 * UNIT-ТЕСТ для UserDeletionService ACCOUNT_SELF_DELETED audit (B6).
 *
 * Запуск: pnpm --filter api test -- user-deletion.service.spec.ts
 */
import type { User } from '@generated/prisma/client';
import { AuditAction } from '@generated/prisma/client';

jest.mock('@repo/api-contracts', () => ({
  USER_DELETION_ERROR_MESSAGES: {
    ADMIN_CANNOT_DELETE: 'Administrators cannot delete their own account.',
    EMAIL_MISMATCH: 'Email confirmation does not match.',
    CURRENT_PASSWORD_REQUIRED: 'Current password is required.',
    INVALID_PASSWORD: 'Current password is incorrect.',
  },
}));

import type { AuditLogService } from '@/audit/audit-log.service';
import type { UserAvatarService } from '@/user/services/user-avatar.service';
import { UserDeletionService } from '@/user/services/user-deletion.service';
import type { UsersService } from '@/user/services/users.service';

const fixedDate = new Date('2026-01-01T00:00:00.000Z');

function createUser(): User {
  return {
    id: 'user-1',
    email: 'user@example.com',
    name: 'User',
    avatar: null,
    role: 'USER',
    passwordHash: null,
    emailVerifiedAt: fixedDate,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

describe('UserDeletionService.deleteAccount (audit)', () => {
  const mockUsersService = {
    findById: jest.fn(),
    normalizeEmail: jest.fn((email: string) => email.trim().toLowerCase()),
    deleteById: jest.fn(),
  };
  const mockUserAvatarService = {
    cleanupManagedAvatarForUser: jest.fn(),
  };
  const mockAuditLogService = {
    record: jest.fn(),
  };

  let service: UserDeletionService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuditLogService.record.mockResolvedValue(undefined);
    mockUsersService.deleteById.mockResolvedValue(undefined);
    mockUserAvatarService.cleanupManagedAvatarForUser.mockResolvedValue(
      undefined,
    );
    service = new UserDeletionService(
      mockUsersService as unknown as UsersService,
      mockUserAvatarService as unknown as UserAvatarService,
      mockAuditLogService as unknown as AuditLogService,
    );
  });

  it('records ACCOUNT_SELF_DELETED after a successful delete', async () => {
    mockUsersService.findById.mockResolvedValue(createUser());

    await service.deleteAccount({
      userId: 'user-1',
      emailConfirmation: 'user@example.com',
    });

    expect(mockUsersService.deleteById).toHaveBeenCalledWith('user-1');
    expect(mockAuditLogService.record).toHaveBeenCalledWith({
      action: AuditAction.ACCOUNT_SELF_DELETED,
      actorId: null,
      targetUserId: null,
      success: true,
      metadata: {
        email: 'user@example.com',
        userId: 'user-1',
      },
    });
  });
});
