import { getTheme, readColorSchemeHint } from "@teispace/next-themes/server";
import { headers } from "next/headers";

export type SsrHtmlThemeProps = {
  htmlClassName?: string;
  dataSsrTheme?: "system";
  colorScheme?: "light" | "dark";
};

/**
 * Props for the root `<html>` first paint: explicit themes use class + color-scheme;
 * `system` without Client Hint uses `data-ssr-theme="system"` + CSS `prefers-color-scheme`.
 */
export async function getSsrHtmlThemeProps(): Promise<SsrHtmlThemeProps> {
  const headerList = await headers();
  const selected = await getTheme({ headers: headerList });

  if (selected === "dark") {
    return { htmlClassName: "dark", colorScheme: "dark" };
  }

  if (selected === "light") {
    return { colorScheme: "light" };
  }

  const hint = readColorSchemeHint(headerList);

  if (hint === "dark") {
    return { htmlClassName: "dark", colorScheme: "dark" };
  }

  if (hint === "light") {
    return { colorScheme: "light" };
  }

  return { dataSsrTheme: "system" };
}
