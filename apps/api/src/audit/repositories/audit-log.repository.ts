import type { AuditLog, Prisma } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';

import type { AuditLogListQuery } from '@/audit/types/audit-log-list-query';
import type { AuditLogRecordInput } from '@/audit/types/audit-log-record-input';
import type { AuditLogWithRelations } from '@/audit/types/audit-log-with-relations';
import { PrismaService } from '@/prisma/prisma.service';

const auditUserSelect = {
  id: true,
  email: true,
  name: true,
} as const;

@Injectable()
export class AuditLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: AuditLogRecordInput): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        action: input.action,
        actorId: input.actorId ?? null,
        targetUserId: input.targetUserId ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        success: input.success,
        metadata: this.toMetadataJson(input.metadata),
      },
    });
  }

  async findManyPaginated(
    query: AuditLogListQuery,
  ): Promise<{ items: AuditLogWithRelations[]; total: number }> {
    const where = this.buildWhere(query);
    const skip = (query.page - 1) * query.pageSize;
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.pageSize,
        include: {
          actor: { select: auditUserSelect },
          targetUser: { select: auditUserSelect },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { items, total };
  }

  findManyForUser(
    userId: string,
    limit: number,
  ): Promise<AuditLogWithRelations[]> {
    return this.prisma.auditLog.findMany({
      where: {
        OR: [{ actorId: userId }, { targetUserId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        actor: { select: auditUserSelect },
        targetUser: { select: auditUserSelect },
      },
    });
  }

  private buildWhere(query: AuditLogListQuery): Prisma.AuditLogWhereInput {
    const createdAt =
      query.from !== undefined || query.to !== undefined
        ? {
            ...(query.from !== undefined ? { gte: query.from } : {}),
            ...(query.to !== undefined ? { lte: query.to } : {}),
          }
        : undefined;

    return {
      ...(query.action !== undefined ? { action: query.action } : {}),
      ...(query.actorId !== undefined ? { actorId: query.actorId } : {}),
      ...(query.targetUserId !== undefined
        ? { targetUserId: query.targetUserId }
        : {}),
      ...(createdAt !== undefined ? { createdAt } : {}),
    };
  }

  private toMetadataJson(
    metadata: Record<string, unknown> | null | undefined,
  ): Prisma.InputJsonValue | undefined {
    if (metadata === null || metadata === undefined) {
      return undefined;
    }

    return metadata as Prisma.InputJsonValue;
  }
}
