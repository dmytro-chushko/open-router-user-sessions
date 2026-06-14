import type { Session } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: {
    tokenHash: string;
    userId: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    expiresAt: Date;
  }): Promise<Session> {
    return this.prisma.session.create({
      data: {
        tokenHash: input.tokenHash,
        userId: input.userId,
        userAgent: input.userAgent ?? null,
        ipAddress: input.ipAddress ?? null,
        expiresAt: input.expiresAt,
      },
    });
  }

  findByTokenHash(tokenHash: string): Promise<Session | null> {
    return this.prisma.session.findUnique({ where: { tokenHash } });
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { tokenHash } });
  }

  async deleteAllForUser(userId: string): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  async deleteAllForUserExceptTokenHash(
    userId: string,
    exceptTokenHash: string,
  ): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        userId,
        NOT: { tokenHash: exceptTokenHash },
      },
    });

    return result.count;
  }
}
