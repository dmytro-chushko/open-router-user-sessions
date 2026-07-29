"use client";

import type { AuditLogItem } from "@repo/api-contracts";
import { ProfileCard, ProfileCardContent } from "@repo/ui";
import { flexRender, type Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

const HERO_COLUMN_ID = "createdAt";

type AuditLogsTableCardsProps = {
  table: Table<AuditLogItem>;
};

/**
 * Mobile card view over the same TanStack Table row model.
 * Cells are rendered via flexRender — no parallel data mapping.
 */
export function AuditLogsTableCards({ table }: AuditLogsTableCardsProps) {
  const t = useTranslations("protected.admin.auditLogs");
  const rows = table.getRowModel().rows;

  return (
    <ul className="space-y-3" role="list">
      {rows.map((row) => {
        const cells = row.getVisibleCells();
        const heroCell = cells.find(
          (cell) => cell.column.id === HERO_COLUMN_ID,
        );
        const fieldCells = cells.filter(
          (cell) => cell.column.id !== HERO_COLUMN_ID,
        );

        return (
          <li key={row.id}>
            <ProfileCard>
              <ProfileCardContent className="space-y-4 p-4">
                {heroCell ? (
                  <div className="font-medium">
                    {flexRender(
                      heroCell.column.columnDef.cell,
                      heroCell.getContext(),
                    )}
                  </div>
                ) : null}
                <dl className="space-y-3">
                  {fieldCells.map((cell) => (
                    <div
                      key={cell.id}
                      className="flex items-start justify-between gap-3"
                    >
                      <dt className="shrink-0 text-sm text-muted-foreground">
                        {t(`columns.${cell.column.id}`)}
                      </dt>
                      <dd className="min-w-0 text-right">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </ProfileCardContent>
            </ProfileCard>
          </li>
        );
      })}
    </ul>
  );
}
