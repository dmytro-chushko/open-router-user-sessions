import { AuditAction, type Role } from '@generated/prisma/client';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { ADMIN_USERS_ERROR_MESSAGES } from '@/admin/errors/admin-users-error-messages';
import {
  AdminUsersRepository,
  type AdminUserDetailRow,
  type AdminUserListRow,
} from '@/admin/repositories/admin-users.repository';
import type { AdminUserDetail } from '@/admin/types/admin-user-detail';
import type { AdminUserListItem } from '@/admin/types/admin-user-list-item';
import type {
  AdminUserListInput,
  AdminUserListQuery,
} from '@/admin/types/admin-user-list-query';
import type { AdminUserListResult } from '@/admin/types/admin-user-list-result';
import type {
  AdminDeleteUserInput,
  AdminUpdateRoleInput,
} from '@/admin/types/admin-users-write-input';
import { AuditLogService } from '@/audit/audit-log.service';
import { withErrorHandling } from '@/common/utils/error/error-handler';
import { UserAvatarService } from '@/user/services/user-avatar.service';
import { UsersService } from '@/user/services/users.service';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

@Injectable()
export class AdminUsersService {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(
    private readonly adminUsersRepository: AdminUsersRepository,
    private readonly auditLogService: AuditLogService,
    private readonly usersService: UsersService,
    private readonly userAvatarService: UserAvatarService,
  ) {}

  list(input: AdminUserListInput = {}): Promise<AdminUserListResult> {
    return withErrorHandling(
      async () => {
        const query = this.normalizeListQuery(input);
        const { items, total } =
          await this.adminUsersRepository.findManyPaginated(query);

        return {
          items: items.map((row) => this.mapListItem(row)),
          total,
          page: query.page,
          pageSize: query.pageSize,
        };
      },
      { logger: this.logger, context: 'AdminUsersService.list' },
    );
  }

  getById(id: string): Promise<AdminUserDetail> {
    return withErrorHandling(
      async () => {
        const user = await this.adminUsersRepository.findDetailById(id);

        if (user === null) {
          throw new NotFoundException(
            ADMIN_USERS_ERROR_MESSAGES.USER_NOT_FOUND,
          );
        }

        return this.mapDetail(user);
      },
      { logger: this.logger, context: 'AdminUsersService.getById' },
    );
  }

  updateRole(input: AdminUpdateRoleInput): Promise<AdminUserDetail> {
    return withErrorHandling(
      async () => {
        const target = await this.adminUsersRepository.findDetailById(
          input.targetUserId,
        );

        if (target === null) {
          throw new NotFoundException(
            ADMIN_USERS_ERROR_MESSAGES.USER_NOT_FOUND,
          );
        }

        if (input.adminId === input.targetUserId) {
          throw new ForbiddenException(
            ADMIN_USERS_ERROR_MESSAGES.CANNOT_CHANGE_OWN_ROLE,
          );
        }

        if (target.role !== input.newRole) {
          await this.assertCanChangeRole(target.role, input.newRole);
        }

        const updated = await this.adminUsersRepository.updateRole(
          input.targetUserId,
          input.newRole,
        );

        await this.auditLogService.record({
          action: AuditAction.USER_ROLE_CHANGED,
          actorId: input.adminId,
          targetUserId: input.targetUserId,
          success: true,
          ipAddress: input.ipAddress ?? null,
          userAgent: input.userAgent ?? null,
          metadata: {
            fromRole: target.role,
            toRole: input.newRole,
          },
        });

        return this.mapDetail(updated);
      },
      { logger: this.logger, context: 'AdminUsersService.updateRole' },
    );
  }

  deleteUser(input: AdminDeleteUserInput): Promise<void> {
    return withErrorHandling(
      async () => {
        const target = await this.usersService.findById(input.targetUserId);

        if (target === null) {
          throw new NotFoundException(
            ADMIN_USERS_ERROR_MESSAGES.USER_NOT_FOUND,
          );
        }

        if (input.adminId === input.targetUserId) {
          throw new ForbiddenException(
            ADMIN_USERS_ERROR_MESSAGES.CANNOT_DELETE_SELF,
          );
        }

        if (target.role === 'ADMIN') {
          await this.assertMoreThanOneAdmin(
            ADMIN_USERS_ERROR_MESSAGES.CANNOT_DELETE_LAST_ADMIN,
          );
        }

        await this.userAvatarService.cleanupManagedAvatarForUser(
          input.targetUserId,
        );
        await this.usersService.deleteById(input.targetUserId);

        await this.auditLogService.record({
          action: AuditAction.USER_DELETED,
          actorId: input.adminId,
          targetUserId: input.targetUserId,
          success: true,
          ipAddress: input.ipAddress ?? null,
          userAgent: input.userAgent ?? null,
          metadata: {
            email: target.email,
            role: target.role,
          },
        });
      },
      { logger: this.logger, context: 'AdminUsersService.deleteUser' },
    );
  }

  private async assertCanChangeRole(
    currentRole: Role,
    newRole: Role,
  ): Promise<void> {
    if (currentRole === 'ADMIN' && newRole === 'USER') {
      await this.assertMoreThanOneAdmin(
        ADMIN_USERS_ERROR_MESSAGES.CANNOT_DEMOTE_LAST_ADMIN,
      );
    }
  }

  private async assertMoreThanOneAdmin(
    errorMessage: (typeof ADMIN_USERS_ERROR_MESSAGES)[keyof typeof ADMIN_USERS_ERROR_MESSAGES],
  ): Promise<void> {
    const adminCount = await this.adminUsersRepository.countAdmins();

    if (adminCount <= 1) {
      throw new BadRequestException(errorMessage);
    }
  }

  private normalizeListQuery(input: AdminUserListInput): AdminUserListQuery {
    const search = input.search?.trim();

    return {
      page: this.normalizePage(input.page),
      pageSize: this.normalizePageSize(input.pageSize),
      role: input.role,
      verified: input.verified,
      createdAfter: input.createdAfter,
      sortBy: input.sortBy ?? 'createdAt',
      sortOrder: input.sortOrder ?? 'desc',
      ...(search !== undefined && search.length > 0 ? { search } : {}),
    };
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

  private mapListItem(row: AdminUserListRow): AdminUserListItem {
    const { passwordHash, accounts, ...publicFields } = row;

    return {
      ...publicFields,
      connectedProviders: accounts.map((account) => account.provider),
      hasPassword: passwordHash !== null && passwordHash.length > 0,
    };
  }

  private mapDetail(row: AdminUserDetailRow): AdminUserDetail {
    const listItem = this.mapListItem(row);

    return {
      ...listItem,
      updatedAt: row.updatedAt,
      sessions: row.sessions.map((session) => ({
        id: session.id,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      })),
    };
  }
}
