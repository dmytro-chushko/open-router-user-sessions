import type { AuditLogsListQuery } from "@repo/api-contracts";

export const DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY: AuditLogsListQuery = {
  page: 1,
  pageSize: 20,
  sortBy: "createdAt",
  sortOrder: "desc",
};
