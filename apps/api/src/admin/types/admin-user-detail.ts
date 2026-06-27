import type { AdminUserListItem } from '@/admin/types/admin-user-list-item';
import type { AdminUserSessionSummary } from '@/admin/types/admin-user-session-summary';

export type AdminUserDetail = AdminUserListItem & {
  updatedAt: Date;
  sessions: AdminUserSessionSummary[];
};
