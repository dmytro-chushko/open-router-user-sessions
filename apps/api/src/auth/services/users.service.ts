import type { User } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';

import { hashPassword, verifyPassword } from '@/auth/crypto/password-hash';
import { UsersRepository } from '@/auth/repositories';
import type { PublicUser } from '@/auth/types/public-user';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(rawEmail: string): Promise<User | null> {
    return this.usersRepository.findByEmail(this.normalizeEmail(rawEmail));
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  findPublicById(id: string): Promise<PublicUser | null> {
    return this.usersRepository.findPublicById(id);
  }

  async createUserWithPassword(input: {
    email: string;
    password: string;
    name?: string | null;
  }): Promise<User> {
    const email = this.normalizeEmail(input.email);
    const passwordHash = await hashPassword(input.password);

    return this.usersRepository.createUser({
      email,
      passwordHash,
      name: input.name,
    });
  }

  async verifyPasswordForUser(
    user: User,
    plainPassword: string,
  ): Promise<boolean> {
    if (user.passwordHash === null || user.passwordHash === '') {
      return false;
    }

    return verifyPassword(plainPassword, user.passwordHash);
  }

  setEmailVerified(userId: string, at: Date): Promise<User> {
    return this.usersRepository.setEmailVerifiedAt(userId, at);
  }

  updatePasswordHash(userId: string, passwordHash: string): Promise<User> {
    return this.usersRepository.updatePasswordHash(userId, passwordHash);
  }

  normalizeEmail(rawEmail: string): string {
    return rawEmail.trim().toLowerCase();
  }
}
