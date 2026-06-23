import type { AuditLog } from '@generated/prisma/client';

export type AuditLogUserSummary = {
  id: string;
  email: string;
  name: string | null;
};

export type AuditLogWithRelations = AuditLog & {
  actor: AuditLogUserSummary | null;
  targetUser: AuditLogUserSummary | null;
};

export type AuditLogListResult = {
  items: AuditLogWithRelations[];
  total: number;
  page: number;
  pageSize: number;
};
