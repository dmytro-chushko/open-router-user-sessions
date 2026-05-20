import type { CookieOptions } from 'express';

import type { AppConfigService } from '@/common/app-config.service';

export function buildSessionCookieOptions(
  appConfig: AppConfigService,
  expiresAt: Date,
): CookieOptions {
  const maxAgeMs = Math.max(0, expiresAt.getTime() - Date.now());

  return {
    httpOnly: true,
    secure: appConfig.cookieSecure,
    sameSite: appConfig.cookieSameSite,
    path: '/',
    maxAge: maxAgeMs,
  };
}

export function buildClearSessionCookieOptions(
  appConfig: AppConfigService,
): CookieOptions {
  return {
    httpOnly: true,
    secure: appConfig.cookieSecure,
    sameSite: appConfig.cookieSameSite,
    path: '/',
  };
}
