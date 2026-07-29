"use client";

import type { AuditLogItem } from "@repo/api-contracts";
import { Button } from "@repo/ui";
import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

type AuditLogsTableColumnHeaderProps = {
  title: string;
  column: Column<AuditLogItem, unknown>;
};

export function AuditLogsTableColumnHeader({
  title,
  column,
}: AuditLogsTableColumnHeaderProps) {
  const t = useTranslations("protected.admin.auditLogs");

  if (!column.getCanSort()) {
    return <span>{title}</span>;
  }

  const sorted = column.getIsSorted();
  const sortLabel =
    sorted === "asc"
      ? t("sort.asc")
      : sorted === "desc"
        ? t("sort.desc")
        : t("sort.none");

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 h-8 gap-1 px-2 has-[>svg]:px-2"
      onClick={column.getToggleSortingHandler()}
      aria-label={`${title}: ${sortLabel}`}
    >
      <span>{title}</span>
      {sorted === "asc" ? (
        <ArrowUp className="size-3.5" aria-hidden="true" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3.5" aria-hidden="true" />
      ) : (
        <ArrowUpDown
          className="size-3.5 text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </Button>
  );
}
