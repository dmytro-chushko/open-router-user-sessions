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

import { useResetPasswordForm } from "@/features/auth/hooks/use-reset-password-form";
import { Link } from "@/i18n/navigation";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations("auth.resetPassword");
  const tCommon = useTranslations("auth.common");
  const { form, handleSubmit, isPending } = useResetPasswordForm(token);

  if (token.trim() === "") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{t("missingToken")}</p>
        <Link className="underline underline-offset-4" href="/forgot-password">
          {t("backToForgot")}
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("newPasswordLabel")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("newPasswordPlaceholder")}
                  autoComplete="new-password"
                  showPasswordLabel={tCommon("showPassword")}
                  hidePasswordLabel={tCommon("hidePassword")}
                  {...field}
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
              <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("confirmPasswordPlaceholder")}
                  autoComplete="new-password"
                  showPasswordLabel={tCommon("showPassword")}
                  hidePasswordLabel={tCommon("hidePassword")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => <input type="hidden" {...field} />}
        />
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? t("submitting") : t("submit")}
        </Button>
      </form>
    </Form>
  );
}
