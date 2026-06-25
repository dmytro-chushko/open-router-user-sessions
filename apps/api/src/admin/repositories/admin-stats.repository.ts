import { Role } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AdminStatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  countTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  countNewUsersSince(since: Date): Promise<number> {
    return this.prisma.user.count({
      where: {
        createdAt: { gte: since },
      },
    });
  }

  countUnverifiedUsers(): Promise<number> {
    return this.prisma.user.count({
      where: {
        emailVerifiedAt: null,
      },
    });
  }

  countAdmins(): Promise<number> {
    return this.prisma.user.count({
      where: {
        role: Role.ADMIN,
      },
    });
  }

  countOauthOnlyUsers(): Promise<number> {
    return this.prisma.user.count({
      where: {
        passwordHash: null,
        accounts: { some: {} },
      },
    });
  }
}
