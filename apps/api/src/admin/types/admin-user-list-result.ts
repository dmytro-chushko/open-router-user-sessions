import type { AdminUserListItem } from '@/admin/types/admin-user-list-item';

export type AdminUserListResult = {
  items: AdminUserListItem[];
  total: number;
  page: number;
  pageSize: number;
};
