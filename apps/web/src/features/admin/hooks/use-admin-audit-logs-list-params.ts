"use client";

import type { AuditLogsListQuery } from "@repo/api-contracts";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY } from "@/entities/admin/model/admin-audit-logs-list-query";
import {
  parseAdminAuditLogsListParams,
  patchAdminAuditLogsListParams,
  serializeAdminAuditLogsListParams,
} from "@/features/admin/model/admin-audit-logs-list-params";
import { usePathname, useRouter } from "@/i18n/navigation";

function buildHref(pathname: string, query: AuditLogsListQuery): string {
  const qs = serializeAdminAuditLogsListParams(query).toString();

  return qs.length > 0 ? `${pathname}?${qs}` : pathname;
}

export function useAdminAuditLogsListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(
    () => parseAdminAuditLogsListParams(searchParams),
    [searchParams],
  );

  const replaceParams = useCallback(
    (next: AuditLogsListQuery) => {
      router.replace(buildHref(pathname, next), { scroll: false });
    },
    [pathname, router],
  );

  const setParams = useCallback(
    (patch: Partial<AuditLogsListQuery>) => {
      replaceParams(patchAdminAuditLogsListParams(params, patch));
    },
    [params, replaceParams],
  );

  const clearFilters = useCallback(() => {
    replaceParams({
      ...DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY,
      pageSize: params.pageSize,
    });
  }, [params.pageSize, replaceParams]);

  return {
    params,
    setParams,
    replaceParams,
    clearFilters,
  };
}
