import type { User } from '@generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';

import { hashPassword, verifyPassword } from '@/auth/crypto/password-hash';
import { UsersRepository } from '@/auth/repositories';
import type { PublicUser } from '@/auth/types/public-user';
import { withErrorHandling } from '@/common/utils/error/error-handler';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(rawEmail: string): Promise<User | null> {
    return withErrorHandling(
      () => this.usersRepository.findByEmail(this.normalizeEmail(rawEmail)),
      { logger: this.logger, context: 'UsersService.findByEmail' },
    );
  }

  findById(id: string): Promise<User | null> {
    return withErrorHandling(() => this.usersRepository.findById(id), {
      logger: this.logger,
      context: 'UsersService.findById',
    });
  }

  findPublicById(id: string): Promise<PublicUser | null> {
    return withErrorHandling(() => this.usersRepository.findPublicById(id), {
      logger: this.logger,
      context: 'UsersService.findPublicById',
    });
  }

  async createUserWithPassword(input: {
    email: string;
    password: string;
    name?: string | null;
  }): Promise<User> {
    return withErrorHandling(
      async () => {
        const email = this.normalizeEmail(input.email);
        const passwordHash = await hashPassword(input.password);

        return this.usersRepository.createUser({
          email,
          passwordHash,
          name: input.name,
        });
      },
      { logger: this.logger, context: 'UsersService.createUserWithPassword' },
    );
  }

  async verifyPasswordForUser(
    user: User,
    plainPassword: string,
  ): Promise<boolean> {
    return withErrorHandling(
      async () => {
        if (user.passwordHash === null || user.passwordHash === '') {
          return false;
        }

        return verifyPassword(plainPassword, user.passwordHash);
      },
      { logger: this.logger, context: 'UsersService.verifyPasswordForUser' },
    );
  }

  setEmailVerified(userId: string, at: Date): Promise<User> {
    return withErrorHandling(
      () => this.usersRepository.setEmailVerifiedAt(userId, at),
      { logger: this.logger, context: 'UsersService.setEmailVerified' },
    );
  }

  updatePasswordHash(userId: string, passwordHash: string): Promise<User> {
    return withErrorHandling(
      () => this.usersRepository.updatePasswordHash(userId, passwordHash),
      { logger: this.logger, context: 'UsersService.updatePasswordHash' },
    );
  }

  normalizeEmail(rawEmail: string): string {
    return rawEmail.trim().toLowerCase();
  }
}
