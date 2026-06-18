"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
} from "@repo/ui";
import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import type { ProfileDeleteAccountFormValues } from "@/features/profile/model/profile-delete-account.schema";

type ProfileDeleteAccountFormFieldsProps = {
  form: UseFormReturn<ProfileDeleteAccountFormValues>;
  email: string;
  hasPassword: boolean;
};

export function ProfileDeleteAccountFormFields({
  form,
  email,
  hasPassword,
}: ProfileDeleteAccountFormFieldsProps) {
  const t = useTranslations("protected.profile.dangerZone");
  const tProfile = useTranslations("protected.profile");

  return (
    <>
      <FormField
        control={form.control}
        name="emailConfirmation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("emailConfirmationLabel")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                autoComplete="off"
                placeholder={email}
                aria-describedby="delete-account-email-hint"
              />
            </FormControl>
            <p
              id="delete-account-email-hint"
              className="text-xs text-muted-foreground"
            >
              {t("emailConfirmationHint")}
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
      {hasPassword ? (
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("currentPassword")}</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoComplete="current-password"
                  showPasswordLabel={tProfile("password.showPassword")}
                  hidePasswordLabel={tProfile("password.hidePassword")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <p className="text-sm text-muted-foreground">{t("oauthReauthHint")}</p>
      )}
    </>
  );
}
