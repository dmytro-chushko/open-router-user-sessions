import { Module } from '@nestjs/common';

import {
  EmailVerificationTokensRepository,
  SessionsRepository,
  UsersRepository,
} from '@/auth/repositories';
import { AuthService, SessionService, UsersService } from '@/auth/services';
import { CommonModule } from '@/common/common.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, CommonModule],
  providers: [
    UsersRepository,
    SessionsRepository,
    EmailVerificationTokensRepository,
    UsersService,
    SessionService,
    AuthService,
  ],
  exports: [AuthService, UsersService, SessionService],
})
export class AuthModule {}
