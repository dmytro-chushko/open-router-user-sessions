import type { Provider, User } from '@generated/prisma/client';
import { ConflictException, Injectable, Logger } from '@nestjs/common';

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
 * OAuth account resolution:
 * 1. Existing `Account` (provider + providerAccountId) → login that User.
 * 2. No Account, but `User` with same email → link new `Account` (no duplicate User).
 * 3. Otherwise → create `User` + `Account`.
 * If the User already has this provider linked to a different provider id → conflict.
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

        const existingUser = await this.usersService.findByEmail(email);

        if (existingUser !== null) {
          return this.linkOAuthToExistingUser(existingUser, input);
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

  private async linkOAuthToExistingUser(
    existingUser: User,
    input: OAuthProfileInput,
  ): Promise<PublicUser> {
    const accountForProvider =
      await this.accountsRepository.findByUserIdAndProvider(
        existingUser.id,
        input.provider,
      );

    if (
      accountForProvider !== null &&
      accountForProvider.providerAccountId !== input.providerAccountId
    ) {
      throw new ConflictException(
        'This email is already linked to another account for this provider',
      );
    }

    if (accountForProvider === null) {
      await this.accountsRepository.create({
        userId: existingUser.id,
        provider: input.provider,
        providerAccountId: input.providerAccountId,
        accessToken: input.accessToken,
        refreshToken: input.refreshToken,
        expiresAt: input.expiresAt,
      });
    }

    if (input.emailVerified && existingUser.emailVerifiedAt === null) {
      await this.usersService.setEmailVerified(existingUser.id, new Date());
    }

    return this.requirePublicUser(existingUser.id);
  }

  private async requirePublicUser(userId: string): Promise<PublicUser> {
    const publicUser = await this.usersService.findPublicById(userId);

    if (publicUser === null) {
      throw new Error(`User ${userId} missing after OAuth`);
    }

    return publicUser;
  }
}
