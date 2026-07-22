"use client";

import type { AdminUsersListQuery } from "@repo/api-contracts";
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui";
import { ListFilter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { hasAdminUsersActiveFilters } from "@/features/admin/lib/has-admin-users-active-filters";
import { UsersTableFiltersFields } from "@/features/admin/ui/users-table/users-table-filters-fields";

const SEARCH_DEBOUNCE_MS = 300;

type UsersTableToolbarProps = {
  params: AdminUsersListQuery;
  onParamsChange: (patch: Partial<AdminUsersListQuery>) => void;
  onClearFilters: () => void;
};

function countSheetFilters(params: AdminUsersListQuery): number {
  let count = 0;

  if (params.role !== undefined) {
    count += 1;
  }

  if (params.verified !== undefined) {
    count += 1;
  }

  if (params.createdAfter !== undefined) {
    count += 1;
  }

  return count;
}

export function UsersTableToolbar({
  params,
  onParamsChange,
  onClearFilters,
}: UsersTableToolbarProps) {
  const t = useTranslations("protected.admin.users");
  const [searchInput, setSearchInput] = useState(params.search ?? "");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const activeFiltersCount = countSheetFilters(params);
  const hasFilters = hasAdminUsersActiveFilters(params);

  useEffect(() => {
    setSearchInput(params.search ?? "");
  }, [params.search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearch =
        searchInput.trim().length > 0 ? searchInput.trim() : undefined;

      if (nextSearch === params.search) {
        return;
      }

      onParamsChange({ search: nextSearch });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput, onParamsChange, params.search]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        value={searchInput}
        onChange={(event) => {
          setSearchInput(event.target.value);
        }}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchAriaLabel")}
        className="min-w-0 w-full max-w-none flex-1 md:min-w-[12rem] md:max-w-sm"
      />
      <div className="hidden items-center gap-2 md:flex">
        <UsersTableFiltersFields
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
            <UsersTableFiltersFields
              params={params}
              onParamsChange={onParamsChange}
              fullWidth
            />
          </div>
          <SheetFooter className="gap-2 sm:flex-col">
            {hasFilters ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClearFilters();
                }}
              >
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
