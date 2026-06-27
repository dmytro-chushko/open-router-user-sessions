import type { Role } from '@generated/prisma/client';

export type AdminUserListSortBy = 'createdAt' | 'email';
export type AdminUserListSortOrder = 'asc' | 'desc';

export type AdminUserListQuery = {
  page: number;
  pageSize: number;
  search?: string;
  role?: Role;
  verified?: boolean;
  createdAfter?: Date;
  sortBy: AdminUserListSortBy;
  sortOrder: AdminUserListSortOrder;
};

export type AdminUserListInput = {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: Role;
  verified?: boolean;
  createdAfter?: Date;
  sortBy?: AdminUserListSortBy;
  sortOrder?: AdminUserListSortOrder;
};
