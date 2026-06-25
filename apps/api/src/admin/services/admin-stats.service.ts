import { Injectable, Logger } from '@nestjs/common';

import { AdminStatsRepository } from '@/admin/repositories';
import type { AdminStatsOverview } from '@/admin/types/admin-stats-overview';
import { withErrorHandling } from '@/common/utils/error/error-handler';

const NEW_USERS_WINDOW_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class AdminStatsService {
  private readonly logger = new Logger(AdminStatsService.name);

  constructor(private readonly adminStatsRepository: AdminStatsRepository) {}

  getOverview(): Promise<AdminStatsOverview> {
    return withErrorHandling(
      async () => {
        const newUsersSince = this.resolveNewUsersSince();
        const [
          totalUsers,
          newUsersLast7Days,
          unverifiedUsers,
          adminCount,
          oauthOnlyUsers,
        ] = await Promise.all([
          this.adminStatsRepository.countTotalUsers(),
          this.adminStatsRepository.countNewUsersSince(newUsersSince),
          this.adminStatsRepository.countUnverifiedUsers(),
          this.adminStatsRepository.countAdmins(),
          this.adminStatsRepository.countOauthOnlyUsers(),
        ]);

        return {
          totalUsers,
          newUsersLast7Days,
          unverifiedUsers,
          adminCount,
          oauthOnlyUsers,
          newUsersSince: newUsersSince.toISOString(),
          generatedAt: new Date().toISOString(),
        };
      },
      { logger: this.logger, context: 'AdminStatsService.getOverview' },
    );
  }

  private resolveNewUsersSince(): Date {
    return new Date(Date.now() - NEW_USERS_WINDOW_DAYS * MS_PER_DAY);
  }
}
