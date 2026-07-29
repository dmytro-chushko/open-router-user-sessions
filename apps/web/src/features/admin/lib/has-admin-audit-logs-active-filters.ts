import type { AuditLogsListQuery } from "@repo/api-contracts";

export function hasAdminAuditLogsActiveFilters(
  params: AuditLogsListQuery,
): boolean {
  return (
    params.action !== undefined ||
    params.from !== undefined ||
    params.to !== undefined
  );
}
