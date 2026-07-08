import { User } from "lucide-react";

import type { NavItem } from "@/shared/shell/model/nav-types";

export type ProfileNavItemId = "overview";

export type ProfileNavItem = NavItem<ProfileNavItemId>;

export const profileNavItems: ProfileNavItem[] = [
  {
    id: "overview",
    href: "/profile",
    match: "exact",
    icon: User,
  },
];
