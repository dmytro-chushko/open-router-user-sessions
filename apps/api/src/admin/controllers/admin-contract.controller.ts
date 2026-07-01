import { Controller, Req, UnauthorizedException } from '@nestjs/common';
import type { AuditLogListResult as ContractAuditLogListResult } from '@repo/api-contracts';
import { adminContract } from '@repo/api-contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import type { Request } from 'express';

import { AdminOnly } from '@/admin/decorators/admin-only.decorator';
import {
  AdminSessionsService,
  AdminStatsService,
  AdminUsersService,
} from '@/admin/services';
import { AuditLogService } from '@/audit/audit-log.service';
import type { AuditLogListResult } from '@/audit/types/audit-log-with-relations';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { PublicUser } from '@/user/types/public-user';

@Controller()
@AdminOnly()
export class AdminContractController {
  constructor(
    private readonly adminStatsService: AdminStatsService,
    private readonly adminUsersService: AdminUsersService,
    private readonly adminSessionsService: AdminSessionsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @TsRestHandler(adminContract.getStats)
  getStats() {
    return tsRestHandler(adminContract.getStats, async () => ({
      status: 200 as const,
      body: await this.adminStatsService.getOverview(),
    }));
  }

  @TsRestHandler(adminContract.listUsers)
  listUsers() {
    return tsRestHandler(adminContract.listUsers, async ({ query }) => ({
      status: 200 as const,
      body: await this.adminUsersService.list({
        page: query.page,
        pageSize: query.pageSize,
        search: query.search,
        role: query.role,
        verified: query.verified,
        createdAfter: query.createdAfter,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      }),
    }));
  }

  @TsRestHandler(adminContract.getUser)
  getUser() {
    return tsRestHandler(adminContract.getUser, async ({ params }) => ({
      status: 200 as const,
      body: await this.adminUsersService.getById(params.id),
    }));
  }

  @TsRestHandler(adminContract.updateUserRole)
  updateUserRole(
    @CurrentUser() user: PublicUser | undefined,
    @Req() req: Request,
  ) {
    return tsRestHandler(
      adminContract.updateUserRole,
      async ({ params, body }) => {
        const admin = this.requireUser(user);

        return {
          status: 200 as const,
          body: await this.adminUsersService.updateRole({
            adminId: admin.id,
            targetUserId: params.id,
            newRole: body.role,
            ipAddress: req.ip ?? null,
            userAgent: this.readUserAgent(req),
          }),
        };
      },
    );
  }

  @TsRestHandler(adminContract.deleteUser)
  deleteUser(@CurrentUser() user: PublicUser | undefined, @Req() req: Request) {
    return tsRestHandler(adminContract.deleteUser, async ({ params }) => {
      const admin = this.requireUser(user);

      await this.adminUsersService.deleteUser({
        adminId: admin.id,
        targetUserId: params.id,
        ipAddress: req.ip ?? null,
        userAgent: this.readUserAgent(req),
      });

      return { status: 204 as const, body: undefined };
    });
  }

  @TsRestHandler(adminContract.revokeUserSessions)
  revokeUserSessions(
    @CurrentUser() user: PublicUser | undefined,
    @Req() req: Request,
  ) {
    return tsRestHandler(
      adminContract.revokeUserSessions,
      async ({ params }) => {
        const admin = this.requireUser(user);

        await this.adminSessionsService.revokeAllForUser({
          adminId: admin.id,
          targetUserId: params.id,
          ipAddress: req.ip ?? null,
          userAgent: this.readUserAgent(req),
        });

        return { status: 204 as const, body: undefined };
      },
    );
  }

  @TsRestHandler(adminContract.listAuditLogs)
  listAuditLogs() {
    return tsRestHandler(adminContract.listAuditLogs, async ({ query }) => ({
      status: 200 as const,
      body: this.mapAuditLogListResult(
        await this.auditLogService.listForAdmin({
          page: query.page,
          pageSize: query.pageSize,
          action: query.action,
          actorId: query.actorId,
          targetUserId: query.targetUserId,
          from: query.from,
          to: query.to,
        }),
      ),
    }));
  }

  private mapAuditLogListResult(
    result: AuditLogListResult,
  ): ContractAuditLogListResult {
    return {
      ...result,
      items: result.items.map((item) => ({
        ...item,
        metadata:
          item.metadata !== null &&
          typeof item.metadata === 'object' &&
          !Array.isArray(item.metadata)
            ? (item.metadata as Record<string, unknown>)
            : null,
      })),
    };
  }

  private requireUser(user: PublicUser | undefined): PublicUser {
    if (user === undefined) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private readUserAgent(req: Request): string | null {
    const value = req.headers['user-agent'];

    return typeof value === 'string' ? value : null;
  }
}
