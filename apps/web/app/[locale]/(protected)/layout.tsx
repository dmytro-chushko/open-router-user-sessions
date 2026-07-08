import type { ReactNode } from "react";

import { verifySession } from "@/shared/auth/verify-session";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  await verifySession();

  return <div className="flex min-h-full flex-1">{children}</div>;
}
