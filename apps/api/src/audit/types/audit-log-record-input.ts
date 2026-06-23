import type { AuditAction } from '@generated/prisma/client';

export type AuditLogRecordInput = {
  action: AuditAction;
  actorId?: string | null;
  targetUserId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  success: boolean;
  metadata?: Record<string, unknown> | null;
};
