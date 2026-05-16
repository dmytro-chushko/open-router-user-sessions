import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { SESSION_COOKIE_STRATEGY_NAME } from '@/auth/constants/session-cookie-strategy-name';
import { EmailVerificationService } from '@/auth/email-verification.service';
import { SessionAuthGuard } from '@/auth/guards/session-auth.guard';
import { SessionCookieStrategy } from '@/auth/passport/session-cookie.strategy';
import { PasswordResetService } from '@/auth/password-reset.service';
import {
  EmailVerificationTokensRepository,
  PasswordResetTokensRepository,
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
    PasswordResetTokensRepository,
    UsersService,
    SessionService,
    AuthService,
    EmailVerificationService,
    PasswordResetService,
    SessionCookieStrategy,
    SessionAuthGuard,
  ],
  exports: [
    AuthService,
    EmailVerificationService,
    PasswordResetService,
    UsersService,
    SessionService,
    PassportModule,
    SessionAuthGuard,
  ],
})
export class AuthModule {}
