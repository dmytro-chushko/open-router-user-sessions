"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@repo/ui";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { stripLocalePrefix } from "@/shared/auth/auth-routes";
import { sidebarNavConfig } from "@/shared/shell/config/sidebar-nav-config";
import { isNavItemActive } from "@/shared/shell/lib/is-nav-item-active";
import type { SidebarScope } from "@/shared/shell/model/nav-types";

const sidebarBelowHeaderClassName =
  "top-(--header-mobile-height) h-[calc(100svh-var(--header-mobile-height))]! sm:top-(--header-tablet-height) sm:h-[calc(100svh-var(--header-tablet-height))]! md:top-(--header-height) md:h-[calc(100svh-var(--header-height))]!";

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  scope: SidebarScope;
};

export function AppSidebar({
  scope,
  collapsible = "icon",
  className,
  ...props
}: AppSidebarProps) {
  const { items, labelNamespace } = sidebarNavConfig[scope];
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
      <SidebarContent className="gap-0">
        <SidebarHeader className="relative z-10 shrink-0 pb-0">
          <SidebarTrigger className="mr-auto" />
        </SidebarHeader>
        <SidebarGroup className="pt-0">
          <SidebarGroupLabel>{t("section")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
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
