import type { Role } from '@generated/prisma/client';

export type AdminUpdateRoleInput = {
  adminId: string;
  targetUserId: string;
  newRole: Role;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type AdminDeleteUserInput = {
  adminId: string;
  targetUserId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};
