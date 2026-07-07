import type { NavItem } from "@/shared/shell/model/nav-types";

export function isNavItemActive(
  item: NavItem,
  pathnameWithoutLocale: string,
): boolean {
  if (item.match === "exact") {
    return pathnameWithoutLocale === item.href;
  }

  return (
    pathnameWithoutLocale === item.href ||
    pathnameWithoutLocale.startsWith(`${item.href}/`)
  );
}
