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

import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password-form";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const { form, handleSubmit, isPending, isSubmitted } =
    useForgotPasswordForm();

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
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? t("submitting") : t("submit")}
        </Button>
        {isSubmitted ? (
          <p className="text-sm text-muted-foreground">{t("submittedHint")}</p>
        ) : null}
      </form>
    </Form>
  );
}
