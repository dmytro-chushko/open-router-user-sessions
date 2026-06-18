"use client";

import { Button } from "@repo/ui";
import { useTranslations } from "next-intl";

import { useModal } from "@/shared/modal/use-modal";

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
  const { open } = useModal("profile-deletion");

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
      <Button
        type="button"
        variant="destructive"
        onClick={() =>
          open("profile-deletion", {
            email,
            hasPassword,
          })
        }
      >
        {t("deleteAccount")}
      </Button>
    </div>
  );
}
