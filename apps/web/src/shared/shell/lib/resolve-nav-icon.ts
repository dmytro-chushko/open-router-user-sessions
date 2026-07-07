import type { LucideIcon } from "lucide-react";
import { Circle } from "lucide-react";

import { adminNavItems } from "@/features/admin/config/admin-nav-items";

const adminNavIcons = Object.fromEntries(
  adminNavItems.map((item) => [item.id, item.icon]),
) as Record<string, LucideIcon>;

const navIconsByNamespace: Record<string, Record<string, LucideIcon>> = {
  "protected.admin.nav": adminNavIcons,
};

export function resolveNavIcon(
  labelNamespace: string,
  itemId: string,
): LucideIcon {
  return navIconsByNamespace[labelNamespace]?.[itemId] ?? Circle;
}
