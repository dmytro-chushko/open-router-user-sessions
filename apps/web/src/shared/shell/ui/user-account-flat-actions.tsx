"use client";

import { Button } from "@repo/ui";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useUserDropdown } from "@/shared/shell/hooks/use-user-dropdown";
import { UserAvatar } from "@/shared/ui/user-avatar";

type UserAccountFlatActionsProps = {
  isAdmin: boolean;
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
  onNavigate?: () => void;
};

const itemClassName =
  "rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground";

export function UserAccountFlatActions({
  isAdmin,
  name,
  email,
  avatarUrl,
  onNavigate,
}: UserAccountFlatActionsProps) {
  const t = useTranslations("header");
  const { handleLogout, isLoggingOut } = useUserDropdown();

  const handleLogoutClick = () => {
    void handleLogout();
    onNavigate?.();
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3">
        <UserAvatar name={name} email={email} avatarUrl={avatarUrl} size="sm" />
        <p className="text-sm font-medium">{name?.trim() || email}</p>
      </div>
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
    </div>
  );
}
