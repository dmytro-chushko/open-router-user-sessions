"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import { useState } from "react";

import { useProfileDeleteAccountForm } from "@/features/profile/hooks/use-profile-delete-account-form";

type ProfileDeleteAccountSectionProps = {
  email: string;
  hasPassword: boolean;
  isAdmin: boolean;
};

export function ProfileDeleteAccountSection({
  email,
  hasPassword,
  isAdmin,
}: ProfileDeleteAccountSectionProps) {
  const t = useTranslations("protected.profile.dangerZone");
  const tProfile = useTranslations("protected.profile");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { form, handleSubmit, isPending } = useProfileDeleteAccountForm({
    email,
    hasPassword,
    onSuccess: () => {
      setIsDialogOpen(false);
    },
  });

  if (isAdmin) {
    return (
      <p className="text-sm text-muted-foreground">{t("adminCannotDelete")}</p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t("description")}</p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>{t("consequences.profile")}</li>
        <li>{t("consequences.sessions")}</li>
        <li>{t("consequences.connectedAccounts")}</li>
        <li>{t("consequences.subscription")}</li>
      </ul>
      <AlertDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);

          if (!open) {
            form.reset();
          }
        }}
      >
        <AlertDialogTrigger asChild>
          <Button type="button" variant="destructive">
            {t("deleteAccount")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dialogTitle")}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>{t("dialogDescription")}</p>
                <p className="font-medium text-foreground">{email}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                <p className="text-sm text-muted-foreground">
                  {t("oauthReauthHint")}
                </p>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  {tProfile("cancel")}
                </AlertDialogCancel>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isPending}
                  aria-busy={isPending}
                >
                  {isPending ? t("deleting") : t("confirmDelete")}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
