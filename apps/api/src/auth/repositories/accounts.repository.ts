import type { Account, Provider } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProviderAndProviderAccountId(
    provider: Provider,
    providerAccountId: string,
  ): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: { provider, providerAccountId },
      },
    });
  }

  create(input: {
    userId: string;
    provider: Provider;
    providerAccountId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresAt?: number | null;
  }): Promise<Account> {
    return this.prisma.account.create({
      data: {
        userId: input.userId,
        provider: input.provider,
        providerAccountId: input.providerAccountId,
        accessToken: input.accessToken ?? null,
        refreshToken: input.refreshToken ?? null,
        expiresAt: input.expiresAt ?? null,
      },
    });
  }
}
