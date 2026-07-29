"use client";

import type { AuditLogsListQuery } from "@repo/api-contracts";
import {
  Button,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui";
import { ListFilter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { hasAdminAuditLogsActiveFilters } from "@/features/admin/lib/has-admin-audit-logs-active-filters";
import { AuditLogsTableFiltersFields } from "@/features/admin/ui/audit-logs/audit-logs-table-filters-fields";

type AuditLogsTableToolbarProps = {
  params: AuditLogsListQuery;
  onParamsChange: (patch: Partial<AuditLogsListQuery>) => void;
  onClearFilters: () => void;
};

function countActiveFilters(params: AuditLogsListQuery): number {
  return [params.action, params.from, params.to].filter(
    (value) => value !== undefined,
  ).length;
}

export function AuditLogsTableToolbar({
  params,
  onParamsChange,
  onClearFilters,
}: AuditLogsTableToolbarProps) {
  const t = useTranslations("protected.admin.auditLogs");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const activeFiltersCount = countActiveFilters(params);
  const hasFilters = hasAdminAuditLogsActiveFilters(params);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="hidden items-center gap-2 md:flex">
        <AuditLogsTableFiltersFields
          params={params}
          onParamsChange={onParamsChange}
        />
        {hasFilters ? (
          <Button type="button" variant="outline" onClick={onClearFilters}>
            {t("clearFilters")}
          </Button>
        ) : null}
      </div>
      <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="shrink-0 md:hidden"
            aria-label={t("filtersButton")}
          >
            <ListFilter className="size-4" aria-hidden="true" />
            <span>
              {activeFiltersCount > 0
                ? t("filtersButtonWithCount", { count: activeFiltersCount })
                : t("filtersButton")}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="gap-0 md:hidden">
          <SheetHeader>
            <SheetTitle>{t("filtersTitle")}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-3 px-4 py-2">
            <AuditLogsTableFiltersFields
              params={params}
              onParamsChange={onParamsChange}
              fullWidth
            />
          </div>
          <SheetFooter className="gap-2 sm:flex-col">
            {hasFilters ? (
              <Button type="button" variant="outline" onClick={onClearFilters}>
                {t("clearFilters")}
              </Button>
            ) : null}
            <Button
              type="button"
              onClick={() => {
                setIsFiltersOpen(false);
              }}
            >
              {t("filtersDone")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
