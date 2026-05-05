"use client";

import type { Locale } from "@repo/translations";
import { locales } from "@repo/translations";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const activeLocale = useLocale() as Locale;
  const t = useTranslations("header");

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-border bg-muted/30 p-1"
      role="navigation"
      aria-label={t("localeSwitcherLabel")}
    >
      {locales.map((target) => (
        <Link
          key={target}
          href={pathname}
          locale={target}
          scroll={false}
          className={
            activeLocale === target
              ? "rounded-md px-2 py-1 font-semibold text-foreground bg-secondary"
              : "rounded-md px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-accent"
          }
        >
          {target === "uk" ? t("localeUk") : t("localeEn")}
        </Link>
      ))}
    </div>
  );
}
