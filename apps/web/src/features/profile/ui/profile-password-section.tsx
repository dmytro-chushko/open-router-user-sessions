"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordInput,
} from "@repo/ui";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useProfilePasswordForm } from "@/features/profile/hooks/use-profile-password-form";
import { Link } from "@/i18n/navigation";

type ProfilePasswordSectionProps = {
  hasPassword: boolean;
};

export function ProfilePasswordSection({
  hasPassword,
}: ProfilePasswordSectionProps) {
  const t = useTranslations("protected.profile.password");
  const tProfile = useTranslations("protected.profile");
  const [isExpanded, setIsExpanded] = useState(false);
  const { form, handleSubmit, isPending } = useProfilePasswordForm({
    hasPassword,
    onSuccess: () => {
      setIsExpanded(false);
    },
  });

  if (!isExpanded) {
    return (
      <div className="space-y-3">
        {!hasPassword ? (
          <p className="text-sm text-muted-foreground">
            {t("oauthSetPasswordHint")}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsExpanded(true);
          }}
        >
          {hasPassword ? t("changePassword") : t("setPassword")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!hasPassword ? (
        <p className="text-sm text-muted-foreground">
          {t("oauthSetPasswordHint")}
        </p>
      ) : null}
      <Form {...form}>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
                      showPasswordLabel={t("showPassword")}
                      hidePasswordLabel={t("hidePassword")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newPassword")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    showPasswordLabel={t("showPassword")}
                    hidePasswordLabel={t("hidePassword")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirmPassword")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    showPasswordLabel={t("showPassword")}
                    hidePasswordLabel={t("hidePassword")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {hasPassword ? (
            <p className="text-sm">
              <Link
                className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                href="/forgot-password"
              >
                {t("forgotCurrentPassword")}
              </Link>
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isPending} aria-busy={isPending}>
              {isPending ? t("savingPassword") : t("savePassword")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                form.reset();
                setIsExpanded(false);
              }}
            >
              {tProfile("cancel")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
