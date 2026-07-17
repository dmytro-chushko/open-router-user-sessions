"use client";

import type { AdminUsersListQuery } from "@repo/api-contracts";
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo } from "react";

import { useAdminUsersQuery } from "@/entities/admin/api/use-admin-users-query";
import { DEFAULT_ADMIN_USERS_LIST_QUERY } from "@/entities/admin/model/admin-users-list-query";
import { useAdminUsersListParams } from "@/features/admin/hooks/use-admin-users-list-params";
import { createUsersTableColumns } from "@/features/admin/ui/users-table/users-table-columns";

type AdminUsersSortColumnId = "user" | "joined";

function resolveSortColumnId(
  sortBy: AdminUsersListQuery["sortBy"],
): AdminUsersSortColumnId {
  return sortBy === "email" ? "user" : "joined";
}

function resolveSortBy(
  columnId: string,
): AdminUsersListQuery["sortBy"] | undefined {
  if (columnId === "user") {
    return "email";
  }

  if (columnId === "joined") {
    return "createdAt";
  }

  return undefined;
}

function resolveUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === "function"
    ? (updater as (value: T) => T)(current)
    : updater;
}

export function useAdminUsersTable() {
  const t = useTranslations("protected.admin.users");
  const format = useFormatter();
  const { params, setParams, clearFilters } = useAdminUsersListParams();
  const query = useAdminUsersQuery({ params });

  const columns = useMemo(
    () =>
      createUsersTableColumns({
        t,
        formatJoinedDate: (value) =>
          format.dateTime(value, { dateStyle: "medium" }),
      }),
    [format, t],
  );

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: params.page - 1,
      pageSize: params.pageSize,
    }),
    [params.page, params.pageSize],
  );

  const sorting = useMemo<SortingState>(
    () => [
      {
        id: resolveSortColumnId(params.sortBy),
        desc: params.sortOrder === "desc",
      },
    ],
    [params.sortBy, params.sortOrder],
  );

  const pageCount = useMemo(() => {
    if (query.data === undefined) {
      return -1;
    }

    return Math.max(1, Math.ceil(query.data.total / params.pageSize));
  }, [params.pageSize, query.data]);

  const table = useReactTable({
    data: query.data?.items ?? [],
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      const next = resolveUpdater(updater, pagination);

      setParams({
        page: next.pageIndex + 1,
        pageSize: next.pageSize,
      });
    },
    onSortingChange: (updater) => {
      const next = resolveUpdater(updater, sorting);
      const primarySort = next[0];

      if (primarySort === undefined) {
        setParams({
          sortBy: DEFAULT_ADMIN_USERS_LIST_QUERY.sortBy,
          sortOrder: DEFAULT_ADMIN_USERS_LIST_QUERY.sortOrder,
        });

        return;
      }

      const sortBy = resolveSortBy(primarySort.id);

      if (sortBy === undefined) {
        return;
      }

      setParams({
        sortBy,
        sortOrder: primarySort.desc ? "desc" : "asc",
      });
    },
  });

  return {
    table,
    query,
    params,
    setParams,
    clearFilters,
    total: query.data?.total ?? 0,
  };
}
