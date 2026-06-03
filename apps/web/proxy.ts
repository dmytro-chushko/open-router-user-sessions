import { acceptClientHintsHeader } from "@teispace/next-themes/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./src/i18n/routing";
import {
  isProtectedPath,
  isPublicAuthPath,
  stripLocalePrefix,
} from "./src/shared/auth/auth-routes";
import { getSessionCookieName } from "./src/shared/config/session-cookie-name";

const intlMiddleware = createMiddleware(routing);

function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies.has(getSessionCookieName());
}

function resolveLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (
    maybeLocale !== undefined &&
    routing.locales.includes(maybeLocale as (typeof routing.locales)[number])
  ) {
    return maybeLocale;
  }

  return routing.defaultLocale;
}

function buildLocalizedLoginUrl(request: NextRequest): URL {
  const locale = resolveLocaleFromPathname(request.nextUrl.pathname);

  return new URL(`/${locale}/login`, request.url);
}

function buildLocalizedDashboardUrl(request: NextRequest): URL {
  const locale = resolveLocaleFromPathname(request.nextUrl.pathname);

  return new URL(`/${locale}/dashboard`, request.url);
}

export default function proxy(request: NextRequest) {
  const pathnameWithoutLocale = stripLocalePrefix(
    request.nextUrl.pathname,
    routing.locales,
  );

  if (isProtectedPath(pathnameWithoutLocale) && !hasSessionCookie(request)) {
    return NextResponse.redirect(buildLocalizedLoginUrl(request));
  }

  const response = intlMiddleware(request);

  if (
    isPublicAuthPath(pathnameWithoutLocale) &&
    hasSessionCookie(request) &&
    response.headers.get("location") === null
  ) {
    return NextResponse.redirect(buildLocalizedDashboardUrl(request));
  }

  response.headers.set("Accept-CH", acceptClientHintsHeader());

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
