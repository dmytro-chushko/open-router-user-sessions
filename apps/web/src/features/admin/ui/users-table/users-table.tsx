"use client";

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { flexRender } from "@tanstack/react-table";

import { useAdminUsersTable } from "@/features/admin/hooks/use-admin-users-table";
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
  const { table, query, params, setParams, clearFilters, total } =
    useAdminUsersTable();

  if (query.isPending && query.data === undefined) {
    return <UsersTableSkeleton />;
  }

  if (query.isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {query.error.message}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <UsersTableToolbar
        params={params}
        onParamsChange={setParams}
        onClearFilters={clearFilters}
      />
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
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
