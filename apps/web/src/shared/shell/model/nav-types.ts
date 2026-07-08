import type { LucideIcon } from "lucide-react";

export type NavItemMatch = "exact" | "prefix";

export type NavItem<TId extends string = string> = {
  id: TId;
  href: string;
  match: NavItemMatch;
  icon: LucideIcon;
};

export type SidebarScope = "admin" | "profile" | "dashboard";

export type SidebarNavConfig<TId extends string = string> = {
  labelNamespace: string;
  items: NavItem<TId>[];
};
