"use client";

import type { AdminUserListItem } from "@repo/api-contracts";
import { ProfileCard, ProfileCardContent } from "@repo/ui";
import { flexRender, type Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

const HERO_COLUMN_ID = "user";
const ACTIONS_COLUMN_ID = "actions";

type UsersTableCardsProps = {
  table: Table<AdminUserListItem>;
};

function getColumnLabelKey(columnId: string): string {
  return `columns.${columnId}`;
}

/**
 * Mobile card view over the same TanStack Table row model.
 * Cells are rendered via flexRender — no parallel data mapping.
 */
export function UsersTableCards({ table }: UsersTableCardsProps) {
  const t = useTranslations("protected.admin.users");
  const rows = table.getRowModel().rows;

  return (
    <ul className="space-y-3" role="list">
      {rows.map((row) => {
        const cells = row.getVisibleCells();
        const heroCell = cells.find(
          (cell) => cell.column.id === HERO_COLUMN_ID,
        );
        const actionsCell = cells.find(
          (cell) => cell.column.id === ACTIONS_COLUMN_ID,
        );
        const fieldCells = cells.filter(
          (cell) =>
            cell.column.id !== HERO_COLUMN_ID &&
            cell.column.id !== ACTIONS_COLUMN_ID,
        );

        return (
          <li key={row.id}>
            <ProfileCard>
              <ProfileCardContent className="space-y-4 p-4">
                {heroCell ? (
                  <div>
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
                        {t(getColumnLabelKey(cell.column.id))}
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
                {actionsCell ? (
                  <div className="border-t border-border pt-3">
                    {flexRender(
                      actionsCell.column.columnDef.cell,
                      actionsCell.getContext(),
                    )}
                  </div>
                ) : null}
              </ProfileCardContent>
            </ProfileCard>
          </li>
        );
      })}
    </ul>
  );
}
