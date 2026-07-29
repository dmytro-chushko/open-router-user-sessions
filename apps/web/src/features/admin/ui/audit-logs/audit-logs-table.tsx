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

import { useAdminAuditLogsTable } from "@/features/admin/hooks/use-admin-audit-logs-table";
import { hasAdminAuditLogsActiveFilters } from "@/features/admin/lib/has-admin-audit-logs-active-filters";
import { AuditLogsTableCards } from "@/features/admin/ui/audit-logs/audit-logs-table-cards";
import { AuditLogsTablePagination } from "@/features/admin/ui/audit-logs/audit-logs-table-pagination";
import { AuditLogsTableToolbar } from "@/features/admin/ui/audit-logs/audit-logs-table-toolbar";

const SKELETON_ROW_COUNT = 5;
const SKELETON_COLUMN_COUNT = 6;
const SKELETON_CARD_COUNT = 3;

function getHeaderAriaSort(
  canSort: boolean,
  sorted: false | "asc" | "desc",
): "ascending" | "descending" | "none" | undefined {
  if (!canSort) {
    return undefined;
  }

  if (sorted === "asc") {
    return "ascending";
  }

  if (sorted === "desc") {
    return "descending";
  }

  return "none";
}

function AuditLogsTableSkeleton() {
  return (
    <>
      <div className="space-y-3 md:hidden" aria-hidden="true">
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-44 w-full rounded-xl" />
        ))}
      </div>
      <div className="hidden space-y-2 md:block" aria-hidden="true">
        <Skeleton className="h-10 w-full rounded-md" />
        {Array.from({ length: SKELETON_ROW_COUNT }, (_, rowIndex) => (
          <div key={rowIndex} className="flex gap-3">
            {Array.from({ length: SKELETON_COLUMN_COUNT }, (_, columnIndex) => (
              <Skeleton key={columnIndex} className="h-12 flex-1 rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function AuditLogsTableEmptyState({
  onClearFilters,
  showClearFilters,
}: {
  onClearFilters: () => void;
  showClearFilters: boolean;
}) {
  const t = useTranslations("protected.admin.auditLogs");

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border px-4 py-10 text-center">
      <p className="text-sm text-muted-foreground">{t("empty")}</p>
      {showClearFilters ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClearFilters}
        >
          {t("clearFilters")}
        </Button>
      ) : null}
    </div>
  );
}

export function AuditLogsTable() {
  const t = useTranslations("protected.admin.auditLogs");
  const { table, query, params, setParams, clearFilters, total } =
    useAdminAuditLogsTable();
  const rows = table.getRowModel().rows;
  const isInitialPending = query.isPending && query.data === undefined;
  const isInitialError = query.isError && query.data === undefined;
  const sortableHeaders =
    table
      .getHeaderGroups()[0]
      ?.headers.filter((header) => header.column.getCanSort()) ?? [];

  if (isInitialPending) {
    return <AuditLogsTableSkeleton />;
  }

  if (isInitialError) {
    return (
      <div className="space-y-4">
        <AuditLogsTableToolbar
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
      <AuditLogsTableToolbar
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
        {rows.length === 0 ? (
          <AuditLogsTableEmptyState
            onClearFilters={clearFilters}
            showClearFilters={hasAdminAuditLogsActiveFilters(params)}
          />
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {sortableHeaders.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {sortableHeaders.map((header) => (
                    <div key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </div>
                  ))}
                </div>
              ) : null}
              <AuditLogsTableCards table={table} />
            </div>
            <div className="hidden md:block">
              <Table className="min-w-[640px]">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          aria-sort={getHeaderAriaSort(
                            header.column.getCanSort(),
                            header.column.getIsSorted(),
                          )}
                        >
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
                  {rows.map((row) => (
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
      <AuditLogsTablePagination
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
