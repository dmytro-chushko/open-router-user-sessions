/**
 * UNIT-ТЕСТ для AuthService.login audit hooks (B6).
 *
 * Запуск: pnpm --filter api test -- auth.service.spec.ts
 */
import type { User } from '@generated/prisma/client';
import { AuditAction } from '@generated/prisma/client';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

import type { AuditLogService } from '@/audit/audit-log.service';
import { AuthService } from '@/auth/services/auth.service';
import type { EmailVerificationService } from '@/auth/services/email-verification.service';
import type { SessionService } from '@/sessions/session.service';
import type { UsersService } from '@/user/services/users.service';
import type { PublicUser } from '@/user/types/public-user';

const fixedDate = new Date('2026-01-01T00:00:00.000Z');

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    email: 'user@example.com',
    name: 'User',
    avatar: null,
    role: 'USER',
    passwordHash: 'hashed',
    emailVerifiedAt: fixedDate,
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createPublicUser(): PublicUser {
  return {
    id: 'user-1',
    email: 'user@example.com',
    name: 'User',
    avatar: null,
    role: 'USER',
    emailVerifiedAt: fixedDate,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

describe('AuthService.login (audit)', () => {
  const mockUsersService = {
    normalizeEmail: jest.fn((email: string) => email.trim().toLowerCase()),
    findByEmail: jest.fn(),
    verifyPasswordForUser: jest.fn(),
    findPublicById: jest.fn(),
  };
  const mockSessionService = {
    createSession: jest.fn(),
  };
  const mockEmailVerificationService = {};
  const mockAuditLogService = {
    record: jest.fn(),
  };

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuditLogService.record.mockResolvedValue(undefined);
    service = new AuthService(
      mockUsersService as unknown as UsersService,
      mockSessionService as unknown as SessionService,
      mockEmailVerificationService as unknown as EmailVerificationService,
      mockAuditLogService as unknown as AuditLogService,
    );
  });

  it('records LOGIN_FAILED when the user does not exist', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'missing@example.com',
        password: 'secret',
        ip: '127.0.0.1',
        userAgent: 'jest',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(mockAuditLogService.record).toHaveBeenCalledWith({
      action: AuditAction.LOGIN_FAILED,
      actorId: null,
      success: false,
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
      metadata: {
        email: 'missing@example.com',
        reason: 'invalid_credentials',
      },
    });
  });

  it('records LOGIN_FAILED when email is not verified', async () => {
    mockUsersService.findByEmail.mockResolvedValue(
      createUser({ emailVerifiedAt: null }),
    );

    await expect(
      service.login({
        email: 'user@example.com',
        password: 'secret',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(mockAuditLogService.record).toHaveBeenCalledWith({
      action: AuditAction.LOGIN_FAILED,
      actorId: 'user-1',
      success: false,
      ipAddress: null,
      userAgent: null,
      metadata: {
        email: 'user@example.com',
        reason: 'email_unverified',
      },
    });
  });

  it('records LOGIN_FAILED when the password is invalid', async () => {
    mockUsersService.findByEmail.mockResolvedValue(createUser());
    mockUsersService.verifyPasswordForUser.mockResolvedValue(false);

    await expect(
      service.login({
        email: 'user@example.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(mockAuditLogService.record).toHaveBeenCalledWith({
      action: AuditAction.LOGIN_FAILED,
      actorId: 'user-1',
      success: false,
      ipAddress: null,
      userAgent: null,
      metadata: {
        email: 'user@example.com',
        reason: 'invalid_credentials',
      },
    });
  });

  it('records LOGIN_SUCCESS after creating a session', async () => {
    mockUsersService.findByEmail.mockResolvedValue(createUser());
    mockUsersService.verifyPasswordForUser.mockResolvedValue(true);
    mockSessionService.createSession.mockResolvedValue({
      rawToken: 'token',
      expiresAt: fixedDate,
    });
    mockUsersService.findPublicById.mockResolvedValue(createPublicUser());

    const result = await service.login({
      email: 'User@Example.com',
      password: 'secret',
      ip: '10.0.0.1',
      userAgent: 'chrome',
    });

    expect(result.user.id).toBe('user-1');
    expect(mockAuditLogService.record).toHaveBeenCalledWith({
      action: AuditAction.LOGIN_SUCCESS,
      actorId: 'user-1',
      success: true,
      ipAddress: '10.0.0.1',
      userAgent: 'chrome',
      metadata: { email: 'user@example.com' },
    });
  });
});
