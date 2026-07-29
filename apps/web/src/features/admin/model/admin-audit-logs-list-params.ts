import {
  auditActionSchema,
  type AuditLogsListQuery,
} from "@repo/api-contracts";

import { DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY } from "@/entities/admin/model/admin-audit-logs-list-query";

const PAGE_SIZE_MAX = 100;

type SearchParamsReader = {
  get(name: string): string | null;
};

const FILTER_PATCH_KEYS = [
  "action",
  "from",
  "to",
  "sortBy",
  "sortOrder",
] as const satisfies ReadonlyArray<keyof AuditLogsListQuery>;

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

function parseAction(
  value: string | null,
): AuditLogsListQuery["action"] | undefined {
  const parsed = auditActionSchema.safeParse(value);

  return parsed.success ? parsed.data : undefined;
}

function parseDate(value: string | null): Date | undefined {
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
): AuditLogsListQuery["sortBy"] | undefined {
  if (value === "createdAt" || value === "action") {
    return value;
  }

  return undefined;
}

function parseSortOrder(
  value: string | null,
): AuditLogsListQuery["sortOrder"] | undefined {
  if (value === "asc" || value === "desc") {
    return value;
  }

  return undefined;
}

/**
 * Parses URL search params into an admin audit logs list query.
 * Invalid values fall back to defaults instead of throwing.
 */
export function parseAdminAuditLogsListParams(
  searchParams: SearchParamsReader,
): AuditLogsListQuery {
  return {
    page: parsePositiveInt(
      searchParams.get("page"),
      DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY.page,
    ),
    pageSize: parsePositiveInt(
      searchParams.get("pageSize"),
      DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY.pageSize,
      PAGE_SIZE_MAX,
    ),
    action: parseAction(searchParams.get("action")),
    from: parseDate(searchParams.get("from")),
    to: parseDate(searchParams.get("to")),
    sortBy:
      parseSortBy(searchParams.get("sortBy")) ??
      DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY.sortBy,
    sortOrder:
      parseSortOrder(searchParams.get("sortOrder")) ??
      DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY.sortOrder,
  };
}

/**
 * Serializes an admin audit logs list query to URL search params.
 * Omits keys that match defaults to keep URLs short.
 */
export function serializeAdminAuditLogsListParams(
  query: AuditLogsListQuery,
): URLSearchParams {
  const params = new URLSearchParams();

  if (query.page !== DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY.page) {
    params.set("page", String(query.page));
  }

  if (query.pageSize !== DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY.pageSize) {
    params.set("pageSize", String(query.pageSize));
  }

  if (query.action !== undefined) {
    params.set("action", query.action);
  }

  if (query.from !== undefined) {
    params.set("from", query.from.toISOString());
  }

  if (query.to !== undefined) {
    params.set("to", query.to.toISOString());
  }

  if (query.sortBy !== DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY.sortBy) {
    params.set("sortBy", query.sortBy);
  }

  if (query.sortOrder !== DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY.sortOrder) {
    params.set("sortOrder", query.sortOrder);
  }

  return params;
}

function shouldResetPage(patch: Partial<AuditLogsListQuery>): boolean {
  return FILTER_PATCH_KEYS.some((key) => key in patch);
}

/**
 * Applies a partial update to the current query.
 * Filter and sort changes reset page to 1.
 */
export function patchAdminAuditLogsListParams(
  current: AuditLogsListQuery,
  patch: Partial<AuditLogsListQuery>,
): AuditLogsListQuery {
  const next: AuditLogsListQuery = {
    ...current,
    ...patch,
  };

  if (shouldResetPage(patch) && patch.page === undefined) {
    next.page = DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY.page;
  }

  return next;
}
