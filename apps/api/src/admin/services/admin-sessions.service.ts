import { AuditAction } from '@generated/prisma/client';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { ADMIN_USERS_ERROR_MESSAGES } from '@/admin/errors/admin-users-error-messages';
import type { AdminRevokeSessionsInput } from '@/admin/types/admin-sessions-write-input';
import { AuditLogService } from '@/audit/audit-log.service';
import { withErrorHandling } from '@/common/utils/error/error-handler';
import { SessionService } from '@/sessions/session.service';
import { UsersService } from '@/user/services/users.service';

@Injectable()
export class AdminSessionsService {
  private readonly logger = new Logger(AdminSessionsService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly auditLogService: AuditLogService,
  ) {}

  revokeAllForUser(input: AdminRevokeSessionsInput): Promise<void> {
    return withErrorHandling(
      async () => {
        const target = await this.usersService.findById(input.targetUserId);

        if (target === null) {
          throw new NotFoundException(
            ADMIN_USERS_ERROR_MESSAGES.USER_NOT_FOUND,
          );
        }

        await this.sessionService.deleteAllSessionsForUser(input.targetUserId);

        await this.auditLogService.record({
          action: AuditAction.SESSIONS_REVOKED,
          actorId: input.adminId,
          targetUserId: input.targetUserId,
          success: true,
          ipAddress: input.ipAddress ?? null,
          userAgent: input.userAgent ?? null,
          metadata: {
            email: target.email,
          },
        });
      },
      { logger: this.logger, context: 'AdminSessionsService.revokeAllForUser' },
    );
  }
}
