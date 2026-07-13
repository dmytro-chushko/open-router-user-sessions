import type { AdminUsersListQuery } from "@repo/api-contracts";

export function adminUsersQueryKey(params: AdminUsersListQuery) {
  return ["admin", "users", params] as const;
}

export const adminUsersQueryKeyRoot = ["admin", "users"] as const;
