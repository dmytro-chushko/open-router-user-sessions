"use client";

import type { AdminUsersListQuery } from "@repo/api-contracts";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { DEFAULT_ADMIN_USERS_LIST_QUERY } from "@/entities/admin/model/admin-users-list-query";
import {
  parseAdminUsersListParams,
  patchAdminUsersListParams,
  serializeAdminUsersListParams,
} from "@/features/admin/model/admin-users-list-params";
import { usePathname, useRouter } from "@/i18n/navigation";

function buildHref(pathname: string, query: AdminUsersListQuery): string {
  const qs = serializeAdminUsersListParams(query).toString();

  return qs.length > 0 ? `${pathname}?${qs}` : pathname;
}

export function useAdminUsersListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(
    () => parseAdminUsersListParams(searchParams),
    [searchParams],
  );

  const replaceParams = useCallback(
    (next: AdminUsersListQuery) => {
      router.replace(buildHref(pathname, next), { scroll: false });
    },
    [pathname, router],
  );

  const setParams = useCallback(
    (patch: Partial<AdminUsersListQuery>) => {
      replaceParams(patchAdminUsersListParams(params, patch));
    },
    [params, replaceParams],
  );

  const clearFilters = useCallback(() => {
    replaceParams({
      ...DEFAULT_ADMIN_USERS_LIST_QUERY,
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
