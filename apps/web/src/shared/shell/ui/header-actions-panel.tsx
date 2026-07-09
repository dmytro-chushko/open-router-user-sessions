"use client";

import { Separator, ThemeModeToggle } from "@repo/ui";
import { useId } from "react";

import { AuthHeaderAction } from "./auth-header-action";
import { LocaleSwitcher } from "./locale-switcher";

import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { isPublicAuthPath, stripLocalePrefix } from "@/shared/auth/auth-routes";

const sectionLabelClassName = "text-sm font-medium text-muted-foreground";

type ThemeLabels = {
  darkLabel: string;
  lightLabel: string;
  systemLabel: string;
  ariaLabel: string;
};

type SectionLabels = {
  theme: string;
  locale: string;
  account: string;
};

type HeaderActionsPanelProps = {
  layout: "row" | "stack";
  themeLabels: ThemeLabels;
  sectionLabels?: SectionLabels;
  onNavigate?: () => void;
  className?: string;
};

export function HeaderActionsPanel({
  layout,
  themeLabels,
  sectionLabels,
  onNavigate,
  className,
}: HeaderActionsPanelProps) {
  const accountLabelId = useId();
  const pathname = usePathname();
  const pathnameWithoutLocale = stripLocalePrefix(pathname, routing.locales);
  const showAccountSection = !isPublicAuthPath(pathnameWithoutLocale);
  const authPresentation = layout === "stack" ? "flat-list" : "dropdown";

  if (layout === "row") {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <ThemeModeToggle {...themeLabels} />
          <LocaleSwitcher onLocaleChange={onNavigate} />
          {showAccountSection ? (
            <AuthHeaderAction presentation={authPresentation} />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <div className="flex flex-col items-start gap-2">
          {sectionLabels ? (
            <p className={sectionLabelClassName} aria-hidden="true">
              {sectionLabels.theme}
            </p>
          ) : null}
          <ThemeModeToggle {...themeLabels} />
        </div>

        <Separator decorative />

        <div className="flex w-full flex-col gap-2">
          {sectionLabels ? (
            <p className={sectionLabelClassName} aria-hidden="true">
              {sectionLabels.locale}
            </p>
          ) : null}
          <LocaleSwitcher fullWidth onLocaleChange={onNavigate} />
        </div>

        {showAccountSection ? (
          <>
            <Separator decorative />
            <div
              role="group"
              {...(sectionLabels?.account
                ? { "aria-labelledby": accountLabelId }
                : {})}
              className="flex flex-col gap-2"
            >
              {sectionLabels ? (
                <p id={accountLabelId} className={sectionLabelClassName}>
                  {sectionLabels.account}
                </p>
              ) : null}
              <AuthHeaderAction
                presentation={authPresentation}
                onNavigate={onNavigate}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
