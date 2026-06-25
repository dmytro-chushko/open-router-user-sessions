import { Module } from '@nestjs/common';

import { AdminGuard } from '@/admin/guards/admin.guard';
import { AdminStatsRepository } from '@/admin/repositories';
import { AdminStatsService } from '@/admin/services';
import { AuditModule } from '@/audit/audit.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuditModule],
  providers: [AdminGuard, AdminStatsRepository, AdminStatsService],
  exports: [AdminGuard, AdminStatsService],
})
export class AdminModule {}
