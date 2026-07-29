"use client";

import {
  auditActionSchema,
  type AuditAction,
  type AuditLogsListQuery,
} from "@repo/api-contracts";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useTranslations } from "next-intl";

const ALL_ACTIONS_VALUE = "all";

type AuditLogsTableFiltersFieldsProps = {
  params: AuditLogsListQuery;
  onParamsChange: (patch: Partial<AuditLogsListQuery>) => void;
  fullWidth?: boolean;
};

/** `<input type="date">` expects a `YYYY-MM-DD` value. */
function toDateInputValue(value: Date | undefined): string {
  return value === undefined ? "" : value.toISOString().slice(0, 10);
}

function fromDateInputValue(
  value: string,
  boundary: "start" | "end",
): Date | undefined {
  if (value === "") {
    return undefined;
  }

  const time = boundary === "start" ? "00:00:00.000" : "23:59:59.999";
  const parsed = new Date(`${value}T${time}Z`);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function AuditLogsTableFiltersFields({
  params,
  onParamsChange,
  fullWidth = false,
}: AuditLogsTableFiltersFieldsProps) {
  const t = useTranslations("protected.admin.auditLogs");
  const controlClassName = fullWidth ? "w-full" : "w-[11rem] shrink-0";

  return (
    <>
      <Select
        value={params.action ?? ALL_ACTIONS_VALUE}
        onValueChange={(value) => {
          onParamsChange({
            action:
              value === ALL_ACTIONS_VALUE ? undefined : (value as AuditAction),
          });
        }}
      >
        <SelectTrigger
          aria-label={t("filters.action")}
          className={controlClassName}
        >
          <SelectValue placeholder={t("filters.actionAll")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_ACTIONS_VALUE}>
            {t("filters.actionAll")}
          </SelectItem>
          {auditActionSchema.options.map((action) => (
            <SelectItem key={action} value={action}>
              {t(`actions.${action}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={toDateInputValue(params.from)}
        aria-label={t("filters.from")}
        className={controlClassName}
        max={toDateInputValue(params.to) || undefined}
        onChange={(event) => {
          onParamsChange({
            from: fromDateInputValue(event.target.value, "start"),
          });
        }}
      />
      <Input
        type="date"
        value={toDateInputValue(params.to)}
        aria-label={t("filters.to")}
        className={controlClassName}
        min={toDateInputValue(params.from) || undefined}
        onChange={(event) => {
          onParamsChange({
            to: fromDateInputValue(event.target.value, "end"),
          });
        }}
      />
    </>
  );
}
