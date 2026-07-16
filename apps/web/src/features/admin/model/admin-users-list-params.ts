import type { AdminUsersListQuery } from "@repo/api-contracts";

import { DEFAULT_ADMIN_USERS_LIST_QUERY } from "@/entities/admin/model/admin-users-list-query";

const SEARCH_MAX_LENGTH = 200;
const PAGE_SIZE_MAX = 100;

type SearchParamsReader = {
  get(name: string): string | null;
};

const FILTER_PATCH_KEYS = [
  "search",
  "role",
  "verified",
  "createdAfter",
  "sortBy",
  "sortOrder",
] as const satisfies ReadonlyArray<keyof AdminUsersListQuery>;

function parsePositiveInt(
  value: string | null,
  fallback: number,
  max?: number,
): number {
  if (value === null || value === "") {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  if (max !== undefined && parsed > max) {
    return max;
  }

  return parsed;
}

function parseRole(
  value: string | null,
): AdminUsersListQuery["role"] | undefined {
  if (value === "USER" || value === "ADMIN") {
    return value;
  }

  return undefined;
}

function parseVerified(
  value: string | null,
): AdminUsersListQuery["verified"] | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

function parseCreatedAfter(
  value: string | null,
): AdminUsersListQuery["createdAfter"] | undefined {
  if (value === null || value === "") {
    return undefined;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

function parseSortBy(
  value: string | null,
): AdminUsersListQuery["sortBy"] | undefined {
  if (value === "createdAt" || value === "email") {
    return value;
  }

  return undefined;
}

function parseSortOrder(
  value: string | null,
): AdminUsersListQuery["sortOrder"] | undefined {
  if (value === "asc" || value === "desc") {
    return value;
  }

  return undefined;
}

function parseSearch(
  value: string | null,
): AdminUsersListQuery["search"] | undefined {
  if (value === null) {
    return undefined;
  }

  const trimmed = value.trim().slice(0, SEARCH_MAX_LENGTH);

  if (trimmed.length === 0) {
    return undefined;
  }

  return trimmed;
}

/**
 * Parses URL search params into an admin users list query.
 * Invalid values fall back to defaults instead of throwing.
 */
export function parseAdminUsersListParams(
  searchParams: SearchParamsReader,
): AdminUsersListQuery {
  return {
    page: parsePositiveInt(
      searchParams.get("page"),
      DEFAULT_ADMIN_USERS_LIST_QUERY.page,
    ),
    pageSize: parsePositiveInt(
      searchParams.get("pageSize"),
      DEFAULT_ADMIN_USERS_LIST_QUERY.pageSize,
      PAGE_SIZE_MAX,
    ),
    search: parseSearch(searchParams.get("search")),
    role: parseRole(searchParams.get("role")),
    verified: parseVerified(searchParams.get("verified")),
    createdAfter: parseCreatedAfter(searchParams.get("createdAfter")),
    sortBy:
      parseSortBy(searchParams.get("sortBy")) ??
      DEFAULT_ADMIN_USERS_LIST_QUERY.sortBy,
    sortOrder:
      parseSortOrder(searchParams.get("sortOrder")) ??
      DEFAULT_ADMIN_USERS_LIST_QUERY.sortOrder,
  };
}

/**
 * Serializes an admin users list query to URL search params.
 * Omits keys that match defaults to keep URLs short.
 */
export function serializeAdminUsersListParams(
  query: AdminUsersListQuery,
): URLSearchParams {
  const params = new URLSearchParams();

  if (query.page !== DEFAULT_ADMIN_USERS_LIST_QUERY.page) {
    params.set("page", String(query.page));
  }

  if (query.pageSize !== DEFAULT_ADMIN_USERS_LIST_QUERY.pageSize) {
    params.set("pageSize", String(query.pageSize));
  }

  if (query.search !== undefined && query.search.length > 0) {
    params.set("search", query.search);
  }

  if (query.role !== undefined) {
    params.set("role", query.role);
  }

  if (query.verified !== undefined) {
    params.set("verified", query.verified ? "true" : "false");
  }

  if (query.createdAfter !== undefined) {
    params.set("createdAfter", query.createdAfter.toISOString());
  }

  if (query.sortBy !== DEFAULT_ADMIN_USERS_LIST_QUERY.sortBy) {
    params.set("sortBy", query.sortBy);
  }

  if (query.sortOrder !== DEFAULT_ADMIN_USERS_LIST_QUERY.sortOrder) {
    params.set("sortOrder", query.sortOrder);
  }

  return params;
}

function shouldResetPage(patch: Partial<AdminUsersListQuery>): boolean {
  return FILTER_PATCH_KEYS.some((key) => key in patch);
}

/**
 * Applies a partial update to the current query.
 * Filter and sort changes reset page to 1.
 */
export function patchAdminUsersListParams(
  current: AdminUsersListQuery,
  patch: Partial<AdminUsersListQuery>,
): AdminUsersListQuery {
  const next: AdminUsersListQuery = {
    ...current,
    ...patch,
  };

  if (shouldResetPage(patch) && patch.page === undefined) {
    next.page = DEFAULT_ADMIN_USERS_LIST_QUERY.page;
  }

  if (next.search !== undefined) {
    const trimmed = next.search.trim().slice(0, SEARCH_MAX_LENGTH);
    next.search = trimmed.length > 0 ? trimmed : undefined;
  }

  return next;
}
