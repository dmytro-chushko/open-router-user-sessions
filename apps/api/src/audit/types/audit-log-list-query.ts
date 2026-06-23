import type { AuditAction } from '@generated/prisma/client';

export type AuditLogListQuery = {
  page: number;
  pageSize: number;
  action?: AuditAction;
  actorId?: string;
  targetUserId?: string;
  from?: Date;
  to?: Date;
};
