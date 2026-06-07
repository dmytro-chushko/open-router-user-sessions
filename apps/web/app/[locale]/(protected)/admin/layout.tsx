import type { ReactNode } from "react";

import { verifyAdminSession } from "@/shared/auth/verify-admin-session";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await verifyAdminSession();

  return children;
}
