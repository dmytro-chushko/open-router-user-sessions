import type { UserPublic } from "@repo/api-contracts";
import { userPublicSchema } from "@repo/api-contracts";
import { cookies } from "next/headers";
import { cache } from "react";

import { redirect } from "@/i18n/navigation";
import { getPublicApiBaseUrl } from "@/shared/config/public-api-url";
import { getSessionCookieName } from "@/shared/config/session-cookie-name";

async function buildCookieHeader(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionName = getSessionCookieName();
  const sessionCookie = cookieStore.get(sessionName);

  if (sessionCookie === undefined) {
    return null;
  }

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

async function fetchCurrentUser(): Promise<UserPublic | null> {
  const cookieHeader = await buildCookieHeader();

  if (cookieHeader === null) {
    return null;
  }

  const response = await fetch(`${getPublicApiBaseUrl()}/auth/me`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Auth me failed with status ${response.status}`);
  }

  const json: unknown = await response.json();

  return userPublicSchema.parse(json);
}

function requireAuthenticated(user: UserPublic | null): UserPublic {
  if (user !== null) {
    return user;
  }

  return redirect({ href: "/login", locale: "en" });
}

export const verifySession = cache(async (): Promise<UserPublic> => {
  return requireAuthenticated(await fetchCurrentUser());
});

export const getOptionalSession = cache(
  async (): Promise<UserPublic | null> => {
    return fetchCurrentUser();
  },
);
