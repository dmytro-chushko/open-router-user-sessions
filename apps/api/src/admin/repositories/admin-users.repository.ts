import { type Provider, Prisma, Role } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';

import type { AdminUserListQuery } from '@/admin/types/admin-user-list-query';
import { PrismaService } from '@/prisma/prisma.service';

const userListSelect = {
  id: true,
  email: true,
  name: true,
  avatar: true,
  role: true,
  emailVerifiedAt: true,
  createdAt: true,
  passwordHash: true,
  accounts: {
    select: {
      provider: true,
    },
  },
} as const;

const userDetailSelect = {
  ...userListSelect,
  updatedAt: true,
  sessions: {
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc' as const,
    },
  },
} as const;

export type AdminUserListRow = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: Role;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  passwordHash: string | null;
  accounts: Array<{ provider: Provider }>;
};

export type AdminUserDetailRow = AdminUserListRow & {
  updatedAt: Date;
  sessions: Array<{
    id: string;
    userAgent: string | null;
    ipAddress: string | null;
    expiresAt: Date;
    createdAt: Date;
  }>;
};

@Injectable()
export class AdminUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findManyPaginated(
    query: AdminUserListQuery,
  ): Promise<{ items: AdminUserListRow[]; total: number }> {
    const where = this.buildWhere(query);
    const skip = (query.page - 1) * query.pageSize;

    return Promise.all([
      this.prisma.user.findMany({
        where,
        select: userListSelect,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.pageSize,
      }),
      this.prisma.user.count({ where }),
    ]).then(([items, total]) => ({ items, total }));
  }

  findDetailById(id: string): Promise<AdminUserDetailRow | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userDetailSelect,
    });
  }

  countAdmins(): Promise<number> {
    return this.prisma.user.count({
      where: {
        role: Role.ADMIN,
      },
    });
  }

  updateRole(userId: string, role: Role): Promise<AdminUserDetailRow> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: userDetailSelect,
    });
  }

  private buildWhere(query: AdminUserListQuery): Prisma.UserWhereInput {
    const search = query.search?.trim();

    return {
      ...(query.role !== undefined ? { role: query.role } : {}),
      ...(query.verified === true ? { emailVerifiedAt: { not: null } } : {}),
      ...(query.verified === false ? { emailVerifiedAt: null } : {}),
      ...(query.createdAfter !== undefined
        ? { createdAt: { gte: query.createdAfter } }
        : {}),
      ...(search !== undefined && search.length > 0
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
  }
}
