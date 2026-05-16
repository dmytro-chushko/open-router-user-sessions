import type { PasswordResetToken } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PasswordResetTokensRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<PasswordResetToken> {
    return this.prisma.passwordResetToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
      },
    });
  }

  findActiveByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
    return this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markConsumed(id: string): Promise<void> {
    await this.prisma.passwordResetToken.update({
      where: { id },
      data: { consumedAt: new Date() },
    });
  }

  findLatestByUserId(userId: string): Promise<PasswordResetToken | null> {
    return this.prisma.passwordResetToken.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteManyUnconsumedByUserId(userId: string): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId, consumedAt: null },
    });
  }
}
