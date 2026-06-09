"use client";

import { Button } from "@repo/ui";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { LoginLinkButton } from "./login-link-button";
import { UserDropdown } from "./user-dropdown";

import { useCurrentUserQuery } from "@/entities/auth";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { isPublicAuthPath, stripLocalePrefix } from "@/shared/auth/auth-routes";

export function AuthHeaderAction() {
  const pathname = usePathname();
  const pathnameWithoutLocale = stripLocalePrefix(pathname, routing.locales);
  const t = useTranslations("header");
  const { data: user, isPending } = useCurrentUserQuery();

  if (isPublicAuthPath(pathnameWithoutLocale)) {
    return null;
  }

  if (isPending) {
    return (
      <Button
        variant="default"
        size="icon"
        className="shrink-0"
        disabled
        aria-label={t("userMenuAriaLabel")}
      >
        <User />
      </Button>
    );
  }

  if (user !== null && user !== undefined) {
    return <UserDropdown isAdmin={user.role === "ADMIN"} />;
  }

  return <LoginLinkButton />;
}
