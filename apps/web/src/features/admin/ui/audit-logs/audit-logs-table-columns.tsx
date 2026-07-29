"use client";

import type { AuditLogItem } from "@repo/api-contracts";
import { Badge } from "@repo/ui";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

import { AuditLogsTableColumnHeader } from "@/features/admin/ui/audit-logs/audit-logs-table-column-header";
import { Link } from "@/i18n/navigation";

type AuditLogsTableTranslator = {
  (key: string): string;
  (key: string, values: Record<string, string>): string;
};

type CreateAuditLogsTableColumnsOptions = {
  t: AuditLogsTableTranslator;
  formatCreatedAt: (value: Date) => string;
};

const columnHelper = createColumnHelper<AuditLogItem>();

function AuditLogDetailsCell({
  metadata,
  t,
}: {
  metadata: AuditLogItem["metadata"];
  t: AuditLogsTableTranslator;
}) {
  if (metadata === null || Object.keys(metadata).length === 0) {
    return (
      <span className="text-muted-foreground text-sm">{t("detailsEmpty")}</span>
    );
  }

  return (
    <details className="text-sm">
      <summary className="cursor-pointer text-primary hover:underline">
        {t("detailsToggle")}
      </summary>
      <pre className="mt-2 max-w-xs overflow-x-auto rounded-md bg-muted p-2 text-left text-xs whitespace-pre-wrap">
        {JSON.stringify(metadata, null, 2)}
      </pre>
    </details>
  );
}

export function createAuditLogsTableColumns({
  t,
  formatCreatedAt,
}: CreateAuditLogsTableColumnsOptions): ColumnDef<AuditLogItem, unknown>[] {
  return [
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: ({ column }) => (
        <AuditLogsTableColumnHeader
          column={column}
          title={t("columns.createdAt")}
        />
      ),
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="tabular-nums text-muted-foreground">
          {formatCreatedAt(getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("action", {
      id: "action",
      header: ({ column }) => (
        <AuditLogsTableColumnHeader
          column={column}
          title={t("columns.action")}
        />
      ),
      enableSorting: true,
      cell: ({ getValue }) => (
        <Badge variant="secondary">{t(`actions.${getValue()}`)}</Badge>
      ),
    }),
    columnHelper.display({
      id: "actor",
      header: ({ column }) => (
        <AuditLogsTableColumnHeader
          column={column}
          title={t("columns.actor")}
        />
      ),
      enableSorting: false,
      cell: ({ row }) => {
        const actor = row.original.actor;

        if (actor === null) {
          return (
            <span className="text-muted-foreground text-sm">
              {t("anonymous")}
            </span>
          );
        }

        return <span className="truncate">{actor.email}</span>;
      },
    }),
    columnHelper.display({
      id: "target",
      header: ({ column }) => (
        <AuditLogsTableColumnHeader
          column={column}
          title={t("columns.target")}
        />
      ),
      enableSorting: false,
      cell: ({ row }) => {
        const targetUser = row.original.targetUser;

        if (targetUser === null) {
          return (
            <span className="text-muted-foreground text-sm">
              {t("targetNone")}
            </span>
          );
        }

        return (
          <Link
            href={`/admin/users/${targetUser.id}`}
            className="font-medium text-primary hover:underline"
            aria-label={t("viewTargetAriaLabel", { email: targetUser.email })}
          >
            {targetUser.email}
          </Link>
        );
      },
    }),
    columnHelper.accessor("success", {
      id: "success",
      header: ({ column }) => (
        <AuditLogsTableColumnHeader
          column={column}
          title={t("columns.success")}
        />
      ),
      enableSorting: false,
      cell: ({ getValue }) => {
        const isSuccess = getValue();

        return (
          <Badge
            variant={isSuccess ? "secondary" : "outline"}
            className={isSuccess ? undefined : "text-destructive"}
          >
            {isSuccess ? t("successYes") : t("successNo")}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "details",
      header: ({ column }) => (
        <AuditLogsTableColumnHeader
          column={column}
          title={t("columns.details")}
        />
      ),
      enableSorting: false,
      cell: ({ row }) => (
        <AuditLogDetailsCell metadata={row.original.metadata} t={t} />
      ),
    }),
  ] as ColumnDef<AuditLogItem, unknown>[];
}
