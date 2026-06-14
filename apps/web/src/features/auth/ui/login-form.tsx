"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
} from "@repo/ui";
import { useTranslations } from "next-intl";

import { useLoginForm } from "@/features/auth/hooks/use-login-form";
import { Link } from "@/i18n/navigation";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("auth.common");
  const {
    form,
    handleSubmit,
    isPending,
    isResending,
    resendCooldownSeconds,
    showEmailNotVerifiedHint,
    handleResendVerification,
    googleAuthHref,
    githubAuthHref,
  } = useLoginForm();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("passwordLabel")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("passwordPlaceholder")}
                  autoComplete="current-password"
                  showPasswordLabel={tCommon("showPassword")}
                  hidePasswordLabel={tCommon("hidePassword")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? t("submitting") : t("submit")}
        </Button>
        {showEmailNotVerifiedHint ? (
          <div className="space-y-2 rounded-md border border-border bg-muted/40 p-3">
            <p className="text-sm text-muted-foreground">
              {t("emailNotVerifiedHint")}
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isResending || resendCooldownSeconds > 0}
              onClick={() => {
                void handleResendVerification();
              }}
            >
              {isResending
                ? t("resending")
                : resendCooldownSeconds > 0
                  ? t("resendCooldown", { seconds: resendCooldownSeconds })
                  : t("resendVerification")}
            </Button>
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button asChild variant="outline">
            <a href={googleAuthHref}>{t("continueGoogle")}</a>
          </Button>
          <Button asChild variant="outline">
            <a href={githubAuthHref}>{t("continueGithub")}</a>
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link
            className="underline underline-offset-4"
            href="/forgot-password"
          >
            {t("forgotPassword")}
          </Link>
          <Link className="underline underline-offset-4" href="/register">
            {t("signUp")}
          </Link>
        </div>
      </form>
    </Form>
  );
}
