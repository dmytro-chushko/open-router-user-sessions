/** Path segments without locale prefix, e.g. "/dashboard" not "/en/dashboard". */
export const PROTECTED_PATHS = ["/dashboard", "/profile"] as const;

export const PUBLIC_AUTH_PATHS = [
  "/login",
  "/register",
  "/verify-email",
  "/verify-email/pending",
  "/forgot-password",
  "/reset-password",
] as const;

export function stripLocalePrefix(
  pathname: string,
  locales: readonly string[],
): string {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (maybeLocale !== undefined && locales.includes(maybeLocale)) {
    const rest = segments.slice(2).join("/");

    return rest.length > 0 ? `/${rest}` : "/";
  }

  return pathname;
}

export function isProtectedPath(pathnameWithoutLocale: string): boolean {
  return PROTECTED_PATHS.some(
    (path) =>
      pathnameWithoutLocale === path ||
      pathnameWithoutLocale.startsWith(`${path}/`),
  );
}

export function isPublicAuthPath(pathnameWithoutLocale: string): boolean {
  return PUBLIC_AUTH_PATHS.some(
    (path) =>
      pathnameWithoutLocale === path ||
      pathnameWithoutLocale.startsWith(`${path}/`),
  );
}
