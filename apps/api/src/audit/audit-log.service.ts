import type { AuditAction } from '@generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';

import { AuditLogRepository } from '@/audit/repositories';
import type { AuditLogListQuery } from '@/audit/types/audit-log-list-query';
import type { AuditLogRecordInput } from '@/audit/types/audit-log-record-input';
import type {
  AuditLogListResult,
  AuditLogWithRelations,
} from '@/audit/types/audit-log-with-relations';
import { withErrorHandling } from '@/common/utils/error/error-handler';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const DEFAULT_USER_LIST_LIMIT = 10;
const MAX_USER_LIST_LIMIT = 50;

export type AuditLogListForAdminInput = {
  page?: number;
  pageSize?: number;
  action?: AuditAction;
  actorId?: string;
  targetUserId?: string;
  from?: Date;
  to?: Date;
};

/**
 * Central entry point for security audit events.
 * `record()` swallows persistence errors so primary business flows are not blocked.
 */
@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async record(input: AuditLogRecordInput): Promise<void> {
    try {
      await this.auditLogRepository.create(input);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`AuditLogService.record failed: ${message}`, stack);
    }
  }

  listForAdmin(
    input: AuditLogListForAdminInput = {},
  ): Promise<AuditLogListResult> {
    return withErrorHandling(
      async () => {
        const page = this.normalizePage(input.page);
        const pageSize = this.normalizePageSize(input.pageSize);
        const query: AuditLogListQuery = {
          page,
          pageSize,
          action: input.action,
          actorId: input.actorId,
          targetUserId: input.targetUserId,
          from: input.from,
          to: input.to,
        };
        const { items, total } =
          await this.auditLogRepository.findManyPaginated(query);

        return {
          items,
          total,
          page,
          pageSize,
        };
      },
      { logger: this.logger, context: 'AuditLogService.listForAdmin' },
    );
  }

  listForUser(
    userId: string,
    limit: number = DEFAULT_USER_LIST_LIMIT,
  ): Promise<AuditLogWithRelations[]> {
    return withErrorHandling(
      async () =>
        this.auditLogRepository.findManyForUser(
          userId,
          this.normalizeUserListLimit(limit),
        ),
      { logger: this.logger, context: 'AuditLogService.listForUser' },
    );
  }

  private normalizePage(page: number | undefined): number {
    if (page === undefined || !Number.isFinite(page)) {
      return DEFAULT_PAGE;
    }

    return Math.max(1, Math.trunc(page));
  }

  private normalizePageSize(pageSize: number | undefined): number {
    if (pageSize === undefined || !Number.isFinite(pageSize)) {
      return DEFAULT_PAGE_SIZE;
    }

    return Math.min(MAX_PAGE_SIZE, Math.max(1, Math.trunc(pageSize)));
  }

  private normalizeUserListLimit(limit: number): number {
    if (!Number.isFinite(limit)) {
      return DEFAULT_USER_LIST_LIMIT;
    }

    return Math.min(MAX_USER_LIST_LIMIT, Math.max(1, Math.trunc(limit)));
  }
}
