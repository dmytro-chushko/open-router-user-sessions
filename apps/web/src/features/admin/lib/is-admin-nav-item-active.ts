import type { AdminNavItem } from "@/features/admin/config/admin-nav-items";
import { isNavItemActive } from "@/shared/shell/lib/is-nav-item-active";

export function isAdminNavItemActive(
  item: AdminNavItem,
  pathnameWithoutLocale: string,
): boolean {
  return isNavItemActive(item, pathnameWithoutLocale);
}
