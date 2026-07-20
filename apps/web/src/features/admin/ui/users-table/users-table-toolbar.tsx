"use client";

import type { AdminUsersListQuery } from "@repo/api-contracts";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { hasAdminUsersActiveFilters } from "@/features/admin/lib/has-admin-users-active-filters";

const SEARCH_DEBOUNCE_MS = 300;

type UsersTableToolbarProps = {
  params: AdminUsersListQuery;
  onParamsChange: (patch: Partial<AdminUsersListQuery>) => void;
  onClearFilters: () => void;
};

export function UsersTableToolbar({
  params,
  onParamsChange,
  onClearFilters,
}: UsersTableToolbarProps) {
  const t = useTranslations("protected.admin.users");
  const [searchInput, setSearchInput] = useState(params.search ?? "");

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
        className="min-w-[12rem] max-w-sm flex-1"
      />
      <Select
        value={params.role ?? "all"}
        onValueChange={(value) => {
          onParamsChange({
            role: value === "all" ? undefined : (value as "USER" | "ADMIN"),
          });
        }}
      >
        <SelectTrigger
          aria-label={t("filters.role")}
          className="w-[11rem] shrink-0"
        >
          <SelectValue placeholder={t("filters.roleAll")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.roleAll")}</SelectItem>
          <SelectItem value="USER">{t("filters.roleUser")}</SelectItem>
          <SelectItem value="ADMIN">{t("filters.roleAdmin")}</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={
          params.verified === undefined
            ? "all"
            : params.verified
              ? "true"
              : "false"
        }
        onValueChange={(value) => {
          onParamsChange({
            verified:
              value === "all" ? undefined : value === "true" ? true : false,
          });
        }}
      >
        <SelectTrigger
          aria-label={t("filters.verified")}
          className="w-[11rem] shrink-0"
        >
          <SelectValue placeholder={t("filters.verifiedAll")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.verifiedAll")}</SelectItem>
          <SelectItem value="true">{t("filters.verifiedYes")}</SelectItem>
          <SelectItem value="false">{t("filters.verifiedNo")}</SelectItem>
        </SelectContent>
      </Select>
      {hasAdminUsersActiveFilters(params) ? (
        <Button type="button" variant="outline" onClick={onClearFilters}>
          {t("clearFilters")}
        </Button>
      ) : null}
    </div>
  );
}
