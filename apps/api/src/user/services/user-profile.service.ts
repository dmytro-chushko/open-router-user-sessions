import type { Provider } from '@generated/prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { hashPassword } from '@/auth/crypto/password-hash';
import { SessionService } from '@/sessions/session.service';
import { AccountsRepository } from '@/user/repositories/accounts.repository';
import { UsersRepository } from '@/user/repositories/users.repository';
import { UsersService } from '@/user/services/users.service';
import type { UserMe } from '@/user/types/user-me';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly accountsRepository: AccountsRepository,
    private readonly sessionService: SessionService,
  ) {}

  async getMeWithProviders(userId: string): Promise<UserMe> {
    const user = await this.usersRepository.findMeById(userId);

    if (user === null) {
      throw new NotFoundException('User not found.');
    }

    const connectedProviders = await this.findConnectedProviders(userId);

    return {
      ...user,
      connectedProviders,
    };
  }

  async updateName(userId: string, name: string | undefined): Promise<UserMe> {
    if (name === undefined) {
      return this.getMeWithProviders(userId);
    }

    const trimmedName = name.trim();

    await this.usersService.updateName(
      userId,
      trimmedName.length > 0 ? trimmedName : null,
    );

    return this.getMeWithProviders(userId);
  }

  async changePassword(input: {
    userId: string;
    currentPassword?: string;
    newPassword: string;
    keepSessionRawToken: string;
  }): Promise<void> {
    const user = await this.usersService.findById(input.userId);

    if (user === null) {
      throw new NotFoundException('User not found.');
    }

    const hasPassword =
      user.passwordHash !== null && user.passwordHash.length > 0;

    if (hasPassword) {
      if (
        input.currentPassword === undefined ||
        input.currentPassword.length === 0
      ) {
        throw new BadRequestException('Current password is required');
      }

      const isValid = await this.usersService.verifyPasswordForUser(
        user,
        input.currentPassword,
      );

      if (!isValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      if (input.currentPassword === input.newPassword) {
        throw new BadRequestException(
          'New password must differ from current password',
        );
      }
    }

    const passwordHash = await hashPassword(input.newPassword);
    await this.usersService.updatePasswordHash(input.userId, passwordHash);
    await this.sessionService.deleteAllSessionsForUserExceptRawToken(
      input.userId,
      input.keepSessionRawToken,
    );
  }

  private async findConnectedProviders(userId: string): Promise<Provider[]> {
    const accounts = await this.accountsRepository.findByUserId(userId);

    return accounts.map((account) => account.provider);
  }
}
