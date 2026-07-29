import type { AuditAction } from '@generated/prisma/client';

export type AuditLogListSortBy = 'createdAt' | 'action';
export type AuditLogListSortOrder = 'asc' | 'desc';

export type AuditLogListQuery = {
  page: number;
  pageSize: number;
  action?: AuditAction;
  actorId?: string;
  targetUserId?: string;
  from?: Date;
  to?: Date;
  sortBy: AuditLogListSortBy;
  sortOrder: AuditLogListSortOrder;
};
