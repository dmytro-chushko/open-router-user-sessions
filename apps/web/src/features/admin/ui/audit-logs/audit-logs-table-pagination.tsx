"use client";

import { Button } from "@repo/ui";
import { useTranslations } from "next-intl";

type AuditLogsTablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function AuditLogsTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
}: AuditLogsTablePaginationProps) {
  const t = useTranslations("protected.admin.auditLogs");
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrevious = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {t("pagination.page", { page, totalPages })}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          disabled={!canPrevious}
          aria-label={t("pagination.previousAriaLabel")}
          onClick={() => {
            onPageChange(page - 1);
          }}
        >
          {t("pagination.previous")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          disabled={!canNext}
          aria-label={t("pagination.nextAriaLabel")}
          onClick={() => {
            onPageChange(page + 1);
          }}
        >
          {t("pagination.next")}
        </Button>
      </div>
    </div>
  );
}
