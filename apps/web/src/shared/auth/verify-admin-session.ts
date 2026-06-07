import type { UserPublic } from "@repo/api-contracts";
import { notFound } from "next/navigation";

import { verifySession } from "@/shared/auth/verify-session";

function requireAdmin(user: UserPublic): UserPublic {
  if (user.role === "ADMIN") {
    return user;
  }

  return notFound();
}

export async function verifyAdminSession(): Promise<UserPublic> {
  return requireAdmin(await verifySession());
}
