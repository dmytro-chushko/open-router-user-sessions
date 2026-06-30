export type AdminRevokeSessionsInput = {
  adminId: string;
  targetUserId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};
