import type { SidebarNavConfig, SidebarScope } from "../model/nav-types";

import { adminNavItems } from "@/features/admin/config/admin-nav-items";
import { dashboardNavItems } from "@/features/dashboard/config/dashboard-nav-items";
import { profileNavItems } from "@/features/profile/config/profile-nav-items";

export const sidebarNavConfig = {
  admin: {
    labelNamespace: "protected.admin.nav",
    items: adminNavItems,
  },
  profile: {
    labelNamespace: "protected.profile.nav",
    items: profileNavItems,
  },
  dashboard: {
    labelNamespace: "protected.dashboard.nav",
    items: dashboardNavItems,
  },
} as const satisfies Record<SidebarScope, SidebarNavConfig>;
