"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@repo/ui";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { stripLocalePrefix } from "@/shared/auth/auth-routes";
import { isNavItemActive } from "@/shared/shell/lib/is-nav-item-active";
import { resolveNavIcon } from "@/shared/shell/lib/resolve-nav-icon";
import type { NavItem } from "@/shared/shell/model/nav-types";

const sidebarBelowHeaderClassName =
  "top-(--header-mobile-height) h-[calc(100svh-var(--header-mobile-height))]! sm:top-(--header-tablet-height) sm:h-[calc(100svh-var(--header-tablet-height))]! md:top-(--header-height) md:h-[calc(100svh-var(--header-height))]!";

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  navItems: NavItem[];
  labelNamespace: string;
};

export function AppSidebar({
  navItems,
  labelNamespace,
  collapsible = "icon",
  className,
  ...props
}: AppSidebarProps) {
  const t = useTranslations(labelNamespace);
  const pathname = usePathname();
  const pathnameWithoutLocale = stripLocalePrefix(pathname, routing.locales);

  return (
    <Sidebar
      collapsible={collapsible}
      className={[sidebarBelowHeaderClassName, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("section")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = resolveNavIcon(labelNamespace, item.id);
                const isActive = isNavItemActive(item, pathnameWithoutLocale);
                const label = t(item.id);

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}
                    >
                      <Link href={item.href}>
                        <Icon aria-hidden="true" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
