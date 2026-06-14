import { Module } from '@nestjs/common';

import { CommonModule } from '@/common/common.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { SessionService } from '@/sessions/session.service';
import { SessionsRepository } from '@/sessions/sessions.repository';

@Module({
  imports: [PrismaModule, CommonModule],
  providers: [SessionsRepository, SessionService],
  exports: [SessionService],
})
export class SessionsModule {}
