"use client";

import { useCurrentUserQuery } from "@/entities/auth";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { isAdminPath, stripLocalePrefix } from "@/shared/auth/auth-routes";

export function useShowAdminNav(): boolean {
  const pathname = usePathname();
  const pathnameWithoutLocale = stripLocalePrefix(pathname, routing.locales);
  const { data: user } = useCurrentUserQuery();

  return isAdminPath(pathnameWithoutLocale) && user?.role === "ADMIN";
}
