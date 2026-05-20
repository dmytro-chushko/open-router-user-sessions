import type { Provider } from '@generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';

import { AccountsRepository } from '@/auth/repositories/accounts.repository';
import { UsersRepository } from '@/auth/repositories/users.repository';
import { UsersService } from '@/auth/services/users.service';
import type { PublicUser } from '@/auth/types/public-user';
import { withErrorHandling } from '@/common/utils/error/error-handler';

export type OAuthProfileInput = {
  provider: Provider;
  providerAccountId: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  emailVerified: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
};

/**
 * C1: resolve User by OAuth Account or create User + Account.
 * C2: link Account to existing User when email already registered.
 */
@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);

  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
  ) {}

  findOrCreateUserFromOAuthProfile(
    input: OAuthProfileInput,
  ): Promise<PublicUser> {
    return withErrorHandling(
      async () => {
        const email = this.usersService.normalizeEmail(input.email);
        const existingAccount =
          await this.accountsRepository.findByProviderAndProviderAccountId(
            input.provider,
            input.providerAccountId,
          );

        if (existingAccount !== null) {
          return this.requirePublicUser(existingAccount.userId);
        }

        const emailVerifiedAt = input.emailVerified ? new Date() : null;
        const user = await this.usersRepository.createOAuthUser({
          email,
          name: input.name,
          avatar: input.avatar,
          emailVerifiedAt,
        });

        await this.accountsRepository.create({
          userId: user.id,
          provider: input.provider,
          providerAccountId: input.providerAccountId,
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          expiresAt: input.expiresAt,
        });

        return this.requirePublicUser(user.id);
      },
      {
        logger: this.logger,
        context: 'OAuthService.findOrCreateUserFromOAuthProfile',
      },
    );
  }

  private async requirePublicUser(userId: string): Promise<PublicUser> {
    const publicUser = await this.usersService.findPublicById(userId);

    if (publicUser === null) {
      throw new Error(`User ${userId} missing after OAuth`);
    }

    return publicUser;
  }
}
