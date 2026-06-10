"use client";

import { Button } from "@repo/ui";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useUserDropdown } from "@/shared/shell/hooks/use-user-dropdown";

type UserAccountFlatActionsProps = {
  isAdmin: boolean;
  onNavigate?: () => void;
};

const itemClassName =
  "rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground";

export function UserAccountFlatActions({
  isAdmin,
  onNavigate,
}: UserAccountFlatActionsProps) {
  const t = useTranslations("header");
  const { handleLogout, isLoggingOut } = useUserDropdown();

  const handleLogoutClick = () => {
    void handleLogout();
    onNavigate?.();
  };

  return (
    <ul className="flex flex-col items-start gap-1" role="list">
      <li>
        <Link href="/profile" className={itemClassName} onClick={onNavigate}>
          {t("profile")}
        </Link>
      </li>
      {isAdmin ? (
        <li>
          <Link href="/admin" className={itemClassName} onClick={onNavigate}>
            {t("admin")}
          </Link>
        </li>
      ) : null}
      <li>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto justify-start px-2 py-1.5 font-normal text-destructive hover:text-destructive"
          disabled={isLoggingOut}
          onClick={handleLogoutClick}
        >
          {t("logOut")}
        </Button>
      </li>
    </ul>
  );
}
