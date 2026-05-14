import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { SESSION_COOKIE_STRATEGY_NAME } from '@/auth/constants/session-cookie-strategy-name';
import { EmailVerificationService } from '@/auth/email-verification.service';
import { SessionAuthGuard } from '@/auth/guards/session-auth.guard';
import { SessionCookieStrategy } from '@/auth/passport/session-cookie.strategy';
import {
  EmailVerificationTokensRepository,
  SessionsRepository,
  UsersRepository,
} from '@/auth/repositories';
import { AuthService, SessionService, UsersService } from '@/auth/services';
import { CommonModule } from '@/common/common.module';
import { MailModule } from '@/mail/mail.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: SESSION_COOKIE_STRATEGY_NAME,
    }),
    PrismaModule,
    CommonModule,
    MailModule,
  ],
  providers: [
    UsersRepository,
    SessionsRepository,
    EmailVerificationTokensRepository,
    UsersService,
    SessionService,
    AuthService,
    EmailVerificationService,
    SessionCookieStrategy,
    SessionAuthGuard,
  ],
  exports: [
    AuthService,
    EmailVerificationService,
    UsersService,
    SessionService,
    PassportModule,
    SessionAuthGuard,
  ],
})
export class AuthModule {}
