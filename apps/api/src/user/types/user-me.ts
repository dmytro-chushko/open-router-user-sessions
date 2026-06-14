import type { Provider } from '@generated/prisma/client';

import type { PublicUser } from '@/user/types/public-user';

export type UserMe = PublicUser & {
  connectedProviders: Provider[];
  hasPassword: boolean;
};
