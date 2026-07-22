"use client";

import type { AdminUsersListQuery } from "@repo/api-contracts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useTranslations } from "next-intl";

type UsersTableFiltersFieldsProps = {
  params: AdminUsersListQuery;
  onParamsChange: (patch: Partial<AdminUsersListQuery>) => void;
  fullWidth?: boolean;
};

export function UsersTableFiltersFields({
  params,
  onParamsChange,
  fullWidth = false,
}: UsersTableFiltersFieldsProps) {
  const t = useTranslations("protected.admin.users");
  const triggerClassName = fullWidth ? "w-full" : "w-[11rem] shrink-0";

  return (
    <>
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
          className={triggerClassName}
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
          className={triggerClassName}
        >
          <SelectValue placeholder={t("filters.verifiedAll")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.verifiedAll")}</SelectItem>
          <SelectItem value="true">{t("filters.verifiedYes")}</SelectItem>
          <SelectItem value="false">{t("filters.verifiedNo")}</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
