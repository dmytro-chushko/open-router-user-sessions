import { SidebarInset } from "@repo/ui";
import type { ReactNode } from "react";

import { verifyAdminSession } from "@/shared/auth/verify-admin-session";
import { AppSidebar } from "@/shared/shell/ui/app-sidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await verifyAdminSession();

  return (
    <>
      <AppSidebar scope="admin" />
      <SidebarInset className="mx-auto w-full max-w-7xl px-6 py-8">
        {children}
      </SidebarInset>
    </>
  );
}
