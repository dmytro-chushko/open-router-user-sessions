import type { AuditLogsListQuery } from "@repo/api-contracts";

export function adminAuditLogsQueryKey(params: AuditLogsListQuery) {
  return ["admin", "audit-logs", params] as const;
}

export const adminAuditLogsQueryKeyRoot = ["admin", "audit-logs"] as const;
