import { getTheme, readColorSchemeHint } from "@teispace/next-themes/server";
import { headers } from "next/headers";

/**
 * Resolves which color scheme to paint on the server (first HTML byte).
 * Matches cookie + optional Sec-CH-Prefers-Color-Scheme when theme is system or unset.
 */
export async function resolveSsrColorScheme(): Promise<"light" | "dark"> {
  const headerList = await headers();
  const selected = await getTheme({ headers: headerList });

  if (selected === "dark") {
    return "dark";
  }

  if (selected === "light") {
    return "light";
  }

  const hint = readColorSchemeHint(headerList);

  if (hint === "dark" || hint === "light") {
    return hint;
  }

  return "light";
}
