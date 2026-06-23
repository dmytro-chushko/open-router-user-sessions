import { Module } from '@nestjs/common';

import { AuditLogService } from '@/audit/audit-log.service';
import { AuditLogRepository } from '@/audit/repositories';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AuditLogRepository, AuditLogService],
  exports: [AuditLogService],
})
export class AuditModule {}
