import type { Provider } from '@generated/prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

import { AccountsRepository } from '@/user/repositories/accounts.repository';
import { UsersService } from '@/user/services/users.service';
import type { UserMe } from '@/user/types/user-me';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsRepository: AccountsRepository,
  ) {}

  async getMeWithProviders(userId: string): Promise<UserMe> {
    const user = await this.usersService.findPublicById(userId);

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

  private async findConnectedProviders(userId: string): Promise<Provider[]> {
    const accounts = await this.accountsRepository.findByUserId(userId);

    return accounts.map((account) => account.provider);
  }
}
