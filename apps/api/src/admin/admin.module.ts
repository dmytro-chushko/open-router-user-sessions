import { Module } from '@nestjs/common';

import { AdminGuard } from '@/admin/guards/admin.guard';
import {
  AdminStatsRepository,
  AdminUsersRepository,
} from '@/admin/repositories';
import { AdminStatsService, AdminUsersService } from '@/admin/services';
import { AuditModule } from '@/audit/audit.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [PrismaModule, AuditModule, UserModule],
  providers: [
    AdminGuard,
    AdminStatsRepository,
    AdminStatsService,
    AdminUsersRepository,
    AdminUsersService,
  ],
  exports: [AdminGuard, AdminStatsService, AdminUsersService],
})
export class AdminModule {}
