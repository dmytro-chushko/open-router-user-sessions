"use client";

import { Button } from "@repo/ui";
import { useTranslations } from "next-intl";

type UsersTablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function UsersTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
}: UsersTablePaginationProps) {
  const t = useTranslations("protected.admin.users");
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrevious = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-muted-foreground">
        {t("pagination.page", { page, totalPages })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
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
