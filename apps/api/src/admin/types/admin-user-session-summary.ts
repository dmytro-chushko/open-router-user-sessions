export type AdminUserSessionSummary = {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: Date;
  createdAt: Date;
};
