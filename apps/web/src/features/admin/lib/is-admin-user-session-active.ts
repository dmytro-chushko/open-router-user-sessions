export function isAdminUserSessionActive(expiresAt: Date): boolean {
  return expiresAt.getTime() > Date.now();
}
