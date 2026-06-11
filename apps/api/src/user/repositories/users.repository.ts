import type { User } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import type { PublicUser } from '@/user/types/public-user';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findPublicById(id: string): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  createUser(input: {
    email: string;
    passwordHash: string;
    name?: string | null;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        name: input.name ?? null,
      },
    });
  }

  createOAuthUser(input: {
    email: string;
    name?: string | null;
    avatar?: string | null;
    emailVerifiedAt?: Date | null;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: null,
        name: input.name ?? null,
        avatar: input.avatar ?? null,
        emailVerifiedAt: input.emailVerifiedAt ?? null,
      },
    });
  }

  setEmailVerifiedAt(userId: string, at: Date): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: at },
    });
  }

  updateName(userId: string, name: string | null): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });
  }

  updateAvatar(userId: string, avatar: string | null): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar },
    });
  }

  updatePasswordHash(userId: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
