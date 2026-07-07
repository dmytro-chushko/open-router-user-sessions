"use client";

import { SidebarTrigger, TopBar } from "@repo/ui";

import { HeaderActionsPanel } from "./header-actions-panel";
import { MobileHeaderSheet } from "./mobile-header-sheet";

import { useShowAdminNav } from "@/features/admin/hooks/use-show-admin-nav";

type ThemeLabels = {
  darkLabel: string;
  lightLabel: string;
  systemLabel: string;
  ariaLabel: string;
};

type MobileMenuLabels = {
  closeLabel: string;
  openAriaLabel: string;
  title: string;
};

type SectionLabels = {
  theme: string;
  locale: string;
  account: string;
};

type ShellHeaderProps = {
  title: string;
  themeLabels: ThemeLabels;
  mobileMenuLabels: MobileMenuLabels;
  sectionLabels: SectionLabels;
};

export function ShellHeader({
  title,
  themeLabels,
  mobileMenuLabels,
  sectionLabels,
}: ShellHeaderProps) {
  const showAdminNav = useShowAdminNav();

  return (
    <TopBar
      className="h-(--header-mobile-height) sm:h-(--header-tablet-height) md:h-(--header-height)"
      trailing={
        <>
          <HeaderActionsPanel
            layout="row"
            themeLabels={themeLabels}
            className="hidden md:flex"
          />
          <MobileHeaderSheet
            themeLabels={themeLabels}
            mobileMenuLabels={mobileMenuLabels}
            sectionLabels={sectionLabels}
          />
        </>
      }
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {showAdminNav ? <SidebarTrigger className="-ml-1" /> : null}
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {title}
        </span>
      </div>
    </TopBar>
  );
}
