import { TopBar, ThemeModeToggle } from "@repo/ui";
import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "./locale-switcher";
import { UserDropdown } from "./user-dropdown";

import { getOptionalSession } from "@/shared/auth/verify-session";

export async function WebTopBar() {
  const t = await getTranslations("header");
  const user = await getOptionalSession();
  const isAdmin = user?.role === "ADMIN";

  return (
    <TopBar
      className="h-(--header-mobile-height) sm:h-(--header-tablet-height) md:h-(--header-height)"
      themeModesSwitcher={
        <ThemeModeToggle
          darkLabel={t("themeDark")}
          lightLabel={t("themeLight")}
          systemLabel={t("themeSystem")}
          ariaLabel={t("themeModeAriaLabel")}
        />
      }
    >
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
        {t("appTitle")}
      </span>
      <LocaleSwitcher />
      {user !== null ? <UserDropdown isAdmin={isAdmin} /> : null}
    </TopBar>
  );
}
