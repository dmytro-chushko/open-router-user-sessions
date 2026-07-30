import { AuditAction } from '@generated/prisma/client';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { AuditLogService } from '@/audit/audit-log.service';
import { EmailVerificationService } from '@/auth/services/email-verification.service';
import { withErrorHandling } from '@/common/utils/error/error-handler';
import { SessionService } from '@/sessions/session.service';
import { UsersService } from '@/user/services/users.service';
import type { PublicUser } from '@/user/types/public-user';

type LoginAuditFailureReason = 'invalid_credentials' | 'email_unverified';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async register(input: {
    email: string;
    password: string;
    name?: string | null;
  }): Promise<PublicUser> {
    return withErrorHandling(
      async () => {
        const email = this.usersService.normalizeEmail(input.email);
        const existing = await this.usersService.findByEmail(email);

        if (existing !== null) {
          throw new ConflictException('Email is already registered');
        }
        const user = await this.usersService.createUserWithPassword({
          email,
          password: input.password,
          name: input.name,
        });
        await this.emailVerificationService.createAndSendForNewUser({
          userId: user.id,
          email: user.email,
        });
        const publicUser = await this.usersService.findPublicById(user.id);

        if (publicUser === null) {
          throw new Error('User missing after registration');
        }

        return publicUser;
      },
      { logger: this.logger, context: 'AuthService.register' },
    );
  }

  async login(input: {
    email: string;
    password: string;
    userAgent?: string | null;
    ip?: string | null;
  }): Promise<{ rawToken: string; expiresAt: Date; user: PublicUser }> {
    return withErrorHandling(
      async () => {
        const email = this.usersService.normalizeEmail(input.email);
        const user = await this.usersService.findByEmail(email);

        if (user === null) {
          await this.recordLoginFailed({
            email,
            reason: 'invalid_credentials',
            ipAddress: input.ip,
            userAgent: input.userAgent,
          });
          throw new UnauthorizedException('Invalid credentials');
        }

        if (user.emailVerifiedAt === null) {
          await this.recordLoginFailed({
            email,
            reason: 'email_unverified',
            actorId: user.id,
            ipAddress: input.ip,
            userAgent: input.userAgent,
          });
          throw new ForbiddenException('Email not verified');
        }
        const passwordOk = await this.usersService.verifyPasswordForUser(
          user,
          input.password,
        );

        if (!passwordOk) {
          await this.recordLoginFailed({
            email,
            reason: 'invalid_credentials',
            actorId: user.id,
            ipAddress: input.ip,
            userAgent: input.userAgent,
          });
          throw new UnauthorizedException('Invalid credentials');
        }
        const { rawToken, expiresAt } = await this.sessionService.createSession(
          {
            userId: user.id,
            userAgent: input.userAgent,
            ip: input.ip,
          },
        );
        const publicUser = await this.usersService.findPublicById(user.id);

        if (publicUser === null) {
          await this.recordLoginFailed({
            email,
            reason: 'invalid_credentials',
            actorId: user.id,
            ipAddress: input.ip,
            userAgent: input.userAgent,
          });
          throw new UnauthorizedException('Invalid credentials');
        }
        await this.auditLogService.record({
          action: AuditAction.LOGIN_SUCCESS,
          actorId: user.id,
          success: true,
          ipAddress: input.ip ?? null,
          userAgent: input.userAgent ?? null,
          metadata: { email },
        });

        return { rawToken, expiresAt, user: publicUser };
      },
      { logger: this.logger, context: 'AuthService.login' },
    );
  }

  async logout(rawToken: string): Promise<void> {
    return withErrorHandling(
      async () => {
        await this.sessionService.deleteSessionByRawToken(rawToken);
      },
      { logger: this.logger, context: 'AuthService.logout' },
    );
  }

  private async recordLoginFailed(input: {
    email: string;
    reason: LoginAuditFailureReason;
    actorId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<void> {
    await this.auditLogService.record({
      action: AuditAction.LOGIN_FAILED,
      actorId: input.actorId ?? null,
      success: false,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      metadata: {
        email: input.email,
        reason: input.reason,
      },
    });
  }
}
