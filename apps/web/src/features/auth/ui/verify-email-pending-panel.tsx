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
} from "@repo/ui";
import { useTranslations } from "next-intl";

import { useVerifyEmailPendingForm } from "@/features/auth/hooks/use-verify-email-pending-form";
import { Link } from "@/i18n/navigation";

type VerifyEmailPendingPanelProps = {
  email: string;
};

export function VerifyEmailPendingPanel({
  email,
}: VerifyEmailPendingPanelProps) {
  const t = useTranslations("auth.verifyEmailPending");
  const { form, handleSubmit, isPending, resendCooldownSeconds } =
    useVerifyEmailPendingForm(email);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{t("description")}</p>
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
          <Button
            className="w-full"
            type="submit"
            disabled={isPending || resendCooldownSeconds > 0}
          >
            {isPending
              ? t("resending")
              : resendCooldownSeconds > 0
                ? t("resendCooldown", { seconds: resendCooldownSeconds })
                : t("resendButton")}
          </Button>
        </form>
      </Form>
      <Link className="text-sm underline underline-offset-4" href="/login">
        {t("goToLogin")}
      </Link>
    </div>
  );
}
