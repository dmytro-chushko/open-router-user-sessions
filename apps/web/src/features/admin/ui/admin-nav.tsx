"use client";

import { useTranslations } from "next-intl";

import { adminNavItems } from "@/features/admin/config/admin-nav-items";
import { isAdminNavItemActive } from "@/features/admin/lib/is-admin-nav-item-active";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { stripLocalePrefix } from "@/shared/auth/auth-routes";

const sectionLabelClassName = "text-sm font-medium text-muted-foreground";

const sheetItemClassName =
  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground";

const sidebarItemClassName =
  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

export type AdminNavVariant = "sheet" | "sidebar";

type AdminNavProps = {
  variant: AdminNavVariant;
  onNavigate?: () => void;
  className?: string;
};

export function AdminNav({ variant, onNavigate, className }: AdminNavProps) {
  const t = useTranslations("protected.admin.nav");
  const pathname = usePathname();
  const pathnameWithoutLocale = stripLocalePrefix(pathname, routing.locales);
  const itemClassName =
    variant === "sheet" ? sheetItemClassName : sidebarItemClassName;

  const links = (
    <ul className="flex flex-col items-stretch gap-1" role="list">
      {adminNavItems.map((item) => {
        const isActive = isAdminNavItemActive(item, pathnameWithoutLocale);
        const Icon = item.icon;

        return (
          <li key={item.id}>
            <Link
              href={item.href}
              className={[
                itemClassName,
                isActive && variant === "sheet"
                  ? "bg-accent font-medium text-accent-foreground"
                  : null,
                isActive && variant === "sidebar"
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : null,
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={isActive ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span>{t(item.id)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "sheet") {
    return (
      <nav
        className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}
        aria-label={t("section")}
      >
        <p className={sectionLabelClassName}>{t("section")}</p>
        {links}
      </nav>
    );
  }

  return (
    <nav className={className} aria-label={t("section")}>
      {links}
    </nav>
  );
}
