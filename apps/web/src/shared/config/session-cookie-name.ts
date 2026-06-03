export function getSessionCookieName(): string {
  return process.env.SESSION_COOKIE_NAME ?? "session";
}
