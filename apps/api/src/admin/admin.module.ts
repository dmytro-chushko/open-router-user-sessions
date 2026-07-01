import { Module } from '@nestjs/common';

import { AdminContractController } from '@/admin/controllers';
import { AdminGuard } from '@/admin/guards/admin.guard';
import {
  AdminStatsRepository,
  AdminUsersRepository,
} from '@/admin/repositories';
import {
  AdminSessionsService,
  AdminStatsService,
  AdminUsersService,
} from '@/admin/services';
import { AuditModule } from '@/audit/audit.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { SessionsModule } from '@/sessions/sessions.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [PrismaModule, AuditModule, UserModule, SessionsModule],
  controllers: [AdminContractController],
  providers: [
    AdminGuard,
    AdminStatsRepository,
    AdminStatsService,
    AdminUsersRepository,
    AdminUsersService,
    AdminSessionsService,
  ],
  exports: [AdminGuard, AdminStatsService, AdminUsersService],
})
export class AdminModule {}
