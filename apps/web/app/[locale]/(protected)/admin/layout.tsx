import { SidebarInset } from "@repo/ui";
import type { ReactNode } from "react";

import { adminNavRoutes } from "@/features/admin/config/admin-nav-items";
import { verifyAdminSession } from "@/shared/auth/verify-admin-session";
import { AppSidebar } from "@/shared/shell/ui/app-sidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await verifyAdminSession();

  return (
    <div className="flex min-h-full flex-1">
      <AppSidebar
        navItems={adminNavRoutes}
        labelNamespace="protected.admin.nav"
      />
      <SidebarInset className="mx-auto w-full max-w-7xl px-6 py-8">
        {children}
      </SidebarInset>
    </div>
  );
}
