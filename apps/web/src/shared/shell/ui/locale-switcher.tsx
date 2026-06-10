"use client";

import type { Locale } from "@repo/translations";
import { locales } from "@repo/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";

type LocaleSwitcherProps = {
  fullWidth?: boolean;
  onLocaleChange?: () => void;
};

function getLocaleLabel(
  locale: Locale,
  translate: (key: "localeEn" | "localeUk") => string,
): string {
  return locale === "uk" ? translate("localeUk") : translate("localeEn");
}

export function LocaleSwitcher({
  fullWidth = false,
  onLocaleChange,
}: LocaleSwitcherProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = useLocale() as Locale;
  const t = useTranslations("header");

  const handleValueChange = (nextLocale: string) => {
    const targetLocale = nextLocale as Locale;

    if (targetLocale === activeLocale) {
      return;
    }

    router.replace(pathname, { locale: targetLocale, scroll: false });
    onLocaleChange?.();
  };

  return (
    <Select value={activeLocale} onValueChange={handleValueChange}>
      <SelectTrigger
        size="default"
        aria-label={t("localeSwitcherLabel")}
        className={
          fullWidth ? "w-full bg-muted/30" : "w-17 shrink-0 bg-muted/30 px-2"
        }
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        position="popper"
        align={fullWidth ? "start" : "end"}
        sideOffset={6}
      >
        {locales.map((target) => (
          <SelectItem key={target} value={target} lang={target}>
            {getLocaleLabel(target, t)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
