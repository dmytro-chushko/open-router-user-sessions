"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

type UserDropdownProps = {
  isAdmin: boolean;
};

export function UserDropdown({ isAdmin }: UserDropdownProps) {
  const t = useTranslations("header");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="icon"
          aria-label={t("userMenuAriaLabel")}
          className="shrink-0"
        >
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile">{t("profile")}</Link>
        </DropdownMenuItem>
        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">{t("admin")}</Link>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
