"use client";

import { Button } from "@repo/ui";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export function LoginLinkButton() {
  const t = useTranslations("home");

  return (
    <Button variant="default" size="icon" className="shrink-0" asChild>
      <Link href="/login" aria-label={t("signIn")}>
        <LogIn />
      </Link>
    </Button>
  );
}
