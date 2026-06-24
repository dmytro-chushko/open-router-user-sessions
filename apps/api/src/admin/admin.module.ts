import { Module } from '@nestjs/common';

import { AdminGuard } from '@/admin/guards/admin.guard';
import { AuditModule } from '@/audit/audit.module';

@Module({
  imports: [AuditModule],
  providers: [AdminGuard],
  exports: [AdminGuard],
})
export class AdminModule {}
