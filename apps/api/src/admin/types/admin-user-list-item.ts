import type { Provider, Role } from '@generated/prisma/client';

export type AdminUserListItem = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: Role;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  connectedProviders: Provider[];
  hasPassword: boolean;
};
