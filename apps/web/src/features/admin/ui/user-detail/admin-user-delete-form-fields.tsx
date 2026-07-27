"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@repo/ui";
import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import type { AdminUserDeleteFormValues } from "@/features/admin/model/admin-user-delete.schema";

type AdminUserDeleteFormFieldsProps = {
  form: UseFormReturn<AdminUserDeleteFormValues>;
  email: string;
};

export function AdminUserDeleteFormFields({
  form,
  email,
}: AdminUserDeleteFormFieldsProps) {
  const t = useTranslations("protected.admin.actions");

  return (
    <FormField
      control={form.control}
      name="emailConfirmation"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("deleteConfirmEmailLabel")}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="email"
              autoComplete="off"
              placeholder={t("deleteConfirmEmailPlaceholder")}
              aria-describedby="admin-delete-user-email-hint"
            />
          </FormControl>
          <p
            id="admin-delete-user-email-hint"
            className="text-xs text-muted-foreground"
          >
            {email}
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
