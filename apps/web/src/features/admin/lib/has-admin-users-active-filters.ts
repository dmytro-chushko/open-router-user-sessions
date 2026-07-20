import type { AdminUsersListQuery } from "@repo/api-contracts";

export function hasAdminUsersActiveFilters(
  params: AdminUsersListQuery,
): boolean {
  return (
    params.search !== undefined ||
    params.role !== undefined ||
    params.verified !== undefined ||
    params.createdAfter !== undefined
  );
}
