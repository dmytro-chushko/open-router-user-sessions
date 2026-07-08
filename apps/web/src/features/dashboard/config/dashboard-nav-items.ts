import { LayoutDashboard } from "lucide-react";

import type { NavItem } from "@/shared/shell/model/nav-types";

export type DashboardNavItemId = "overview";

export type DashboardNavItem = NavItem<DashboardNavItemId>;

export const dashboardNavItems: DashboardNavItem[] = [
  {
    id: "overview",
    href: "/dashboard",
    match: "exact",
    icon: LayoutDashboard,
  },
];
