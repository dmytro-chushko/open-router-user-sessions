import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { SESSION_COOKIE_STRATEGY_NAME } from '@/auth/constants/session-cookie-strategy-name';
import { SessionAuthGuard } from '@/auth/guards/session-auth.guard';
import { GitHubStrategy } from '@/auth/oauth/github.strategy';
import { GoogleStrategy } from '@/auth/oauth/google.strategy';
import { OAuthController } from '@/auth/oauth/oauth.controller';
import { OAuthService } from '@/auth/oauth/oauth.service';
import { SessionCookieStrategy } from '@/auth/passport/session-cookie.strategy';
import {
  AccountsRepository,
  EmailVerificationTokensRepository,
  PasswordResetTokensRepository,
  SessionsRepository,
  UsersRepository,
} from '@/auth/repositories';
import {
  AuthService,
  EmailVerificationService,
  PasswordResetService,
  SessionService,
  UsersService,
} from '@/auth/services';
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
  controllers: [OAuthController],
  providers: [
    UsersRepository,
    AccountsRepository,
    SessionsRepository,
    EmailVerificationTokensRepository,
    PasswordResetTokensRepository,
    UsersService,
    SessionService,
    AuthService,
    EmailVerificationService,
    PasswordResetService,
    OAuthService,
    GoogleStrategy,
    GitHubStrategy,
    SessionCookieStrategy,
    SessionAuthGuard,
  ],
  exports: [
    AuthService,
    EmailVerificationService,
    PasswordResetService,
    OAuthService,
    UsersService,
    SessionService,
    PassportModule,
    SessionAuthGuard,
  ],
})
export class AuthModule {}
