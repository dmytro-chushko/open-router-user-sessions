"use client";

import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { flexRender } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { useAdminUsersTable } from "@/features/admin/hooks/use-admin-users-table";
import { hasAdminUsersActiveFilters } from "@/features/admin/lib/has-admin-users-active-filters";
import { UsersTablePagination } from "@/features/admin/ui/users-table/users-table-pagination";
import { UsersTableToolbar } from "@/features/admin/ui/users-table/users-table-toolbar";

const SKELETON_ROW_COUNT = 5;
const SKELETON_COLUMN_COUNT = 6;

function UsersTableSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      <Skeleton className="h-10 w-full rounded-md" />
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {Array.from({ length: SKELETON_COLUMN_COUNT }, (_, columnIndex) => (
            <Skeleton key={columnIndex} className="h-12 flex-1 rounded-md" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function UsersTable() {
  const t = useTranslations("protected.admin.users");
  const { table, query, params, setParams, clearFilters, total } =
    useAdminUsersTable();
  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length;
  const isInitialPending = query.isPending && query.data === undefined;
  const isInitialError = query.isError && query.data === undefined;

  if (isInitialPending) {
    return <UsersTableSkeleton />;
  }

  if (isInitialError) {
    return (
      <div className="space-y-4">
        <UsersTableToolbar
          params={params}
          onParamsChange={setParams}
          onClearFilters={clearFilters}
        />
        <div className="space-y-3" role="alert">
          <p className="text-sm text-destructive">{t("loadError")}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void query.refetch();
            }}
          >
            {t("retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UsersTableToolbar
        params={params}
        onParamsChange={setParams}
        onClearFilters={clearFilters}
      />
      <div
        aria-busy={query.isFetching || undefined}
        className={
          query.isFetching ? "opacity-60 transition-opacity" : undefined
        }
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      {t("empty")}
                    </p>
                    {hasAdminUsersActiveFilters(params) ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                      >
                        {t("clearFilters")}
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <UsersTablePagination
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        onPageChange={(page) => {
          setParams({ page });
        }}
      />
    </div>
  );
}
