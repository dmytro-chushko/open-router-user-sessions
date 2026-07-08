import { LayoutDashboard, ScrollText, Users } from "lucide-react";

import type { NavItem } from "@/shared/shell/model/nav-types";

export type AdminNavItemId = "overview" | "users" | "auditLogs";

export type AdminNavItem = NavItem<AdminNavItemId>;

export const adminNavItems: AdminNavItem[] = [
  {
    id: "overview",
    href: "/admin",
    match: "exact",
    icon: LayoutDashboard,
  },
  {
    id: "users",
    href: "/admin/users",
    match: "prefix",
    icon: Users,
  },
  {
    id: "auditLogs",
    href: "/admin/audit-logs",
    match: "prefix",
    icon: ScrollText,
  },
];
