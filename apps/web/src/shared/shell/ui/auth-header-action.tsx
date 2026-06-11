"use client";

import { Button } from "@repo/ui";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { LoginLinkButton } from "./login-link-button";
import { UserAccountFlatActions } from "./user-account-flat-actions";
import { UserDropdown } from "./user-dropdown";

import { useCurrentUserQuery } from "@/entities/auth";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { isPublicAuthPath, stripLocalePrefix } from "@/shared/auth/auth-routes";

type AuthHeaderActionProps = {
  onNavigate?: () => void;
  presentation?: "dropdown" | "flat-list";
};

export function AuthHeaderAction({
  onNavigate,
  presentation = "dropdown",
}: AuthHeaderActionProps = {}) {
  const pathname = usePathname();
  const pathnameWithoutLocale = stripLocalePrefix(pathname, routing.locales);
  const t = useTranslations("header");
  const tHello = useTranslations("hello");
  const { data: user, isPending } = useCurrentUserQuery();

  if (isPublicAuthPath(pathnameWithoutLocale)) {
    return null;
  }

  if (isPending) {
    if (presentation === "flat-list") {
      return (
        <div aria-busy="true" aria-live="polite">
          <span className="sr-only">{tHello("loading")}</span>
        </div>
      );
    }

    return (
      <Button
        variant="default"
        size="icon"
        className="shrink-0"
        disabled
        aria-busy="true"
        aria-label={t("userMenuAriaLabel")}
      >
        <User />
      </Button>
    );
  }

  if (user !== null && user !== undefined) {
    if (presentation === "flat-list") {
      return (
        <UserAccountFlatActions
          isAdmin={user.role === "ADMIN"}
          name={user.name}
          email={user.email}
          avatarUrl={user.avatar}
          onNavigate={onNavigate}
        />
      );
    }

    return (
      <UserDropdown
        isAdmin={user.role === "ADMIN"}
        name={user.name}
        email={user.email}
        avatarUrl={user.avatar}
      />
    );
  }

  return <LoginLinkButton onNavigate={onNavigate} />;
}
