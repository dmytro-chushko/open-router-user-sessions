import { TopBar, ThemeModeToggle } from "@repo/ui";
import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "./locale-switcher";

export async function WebTopBar() {
  const t = await getTranslations("header");

  return (
    <TopBar
      className="h-(--header-mobile-height) sm:h-(--header-tablet-height) md:h-(--header-height)"
      themeModesSwitcher={
        <ThemeModeToggle
          darkLabel={t("themeDark")}
          lightLabel={t("themeLight")}
          systemLabel={t("themeSystem")}
        />
      }
    >
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
        {t("appTitle")}
      </span>
      <LocaleSwitcher />
    </TopBar>
  );
}
