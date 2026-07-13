import type { AdminUsersListQuery } from "@repo/api-contracts";

export const DEFAULT_ADMIN_USERS_LIST_QUERY: AdminUsersListQuery = {
  page: 1,
  pageSize: 20,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export type AdminUsersListQueryInput = Partial<AdminUsersListQuery>;
