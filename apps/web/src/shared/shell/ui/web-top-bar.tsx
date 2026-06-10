import { getTranslations } from "next-intl/server";

import { ShellHeader } from "./shell-header";

export async function WebTopBar() {
  const t = await getTranslations("header");

  return (
    <ShellHeader
      title={t("appTitle")}
      themeLabels={{
        darkLabel: t("themeDark"),
        lightLabel: t("themeLight"),
        systemLabel: t("themeSystem"),
        ariaLabel: t("themeModeAriaLabel"),
      }}
      mobileMenuLabels={{
        closeLabel: t("mobileMenuCloseLabel"),
        openAriaLabel: t("mobileMenuOpenAriaLabel"),
        title: t("mobileMenuTitle"),
      }}
      sectionLabels={{
        theme: t("mobileMenuThemeSection"),
        locale: t("mobileMenuLocaleSection"),
        account: t("mobileMenuAccountSection"),
      }}
    />
  );
}
