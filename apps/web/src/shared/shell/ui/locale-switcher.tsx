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
      className="flex shrink-0 items-center gap-1 text-sm"
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
              ? "rounded-md px-2 py-1 font-semibold text-foreground"
              : "rounded-md px-2 py-1 text-muted-foreground hover:text-foreground"
          }
        >
          {target === "uk" ? t("localeUk") : t("localeEn")}
        </Link>
      ))}
    </div>
  );
}
