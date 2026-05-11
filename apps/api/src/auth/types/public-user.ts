import type { Role } from '@generated/prisma/client';

/**
 * User fields safe to return from the API (no `passwordHash`).
 */
export type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: Role;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
