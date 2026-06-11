import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { SESSION_COOKIE_STRATEGY_NAME } from '@/auth/constants/session-cookie-strategy-name';
import { AuthContractController, OAuthController } from '@/auth/controllers';
import { SessionAuthGuard } from '@/auth/guards/session-auth.guard';
import {
  GitHubStrategy,
  GoogleStrategy,
  SessionCookieStrategy,
} from '@/auth/passport';
import {
  EmailVerificationTokensRepository,
  PasswordResetTokensRepository,
  SessionsRepository,
} from '@/auth/repositories';
import {
  AuthService,
  EmailVerificationService,
  OAuthService,
  PasswordResetService,
  SessionService,
} from '@/auth/services';
import { CommonModule } from '@/common/common.module';
import { MailModule } from '@/mail/mail.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: SESSION_COOKIE_STRATEGY_NAME,
    }),
    PrismaModule,
    CommonModule,
    MailModule,
    UserModule,
  ],
  controllers: [AuthContractController, OAuthController],
  providers: [
    SessionsRepository,
    EmailVerificationTokensRepository,
    PasswordResetTokensRepository,
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
    SessionService,
    PassportModule,
    SessionAuthGuard,
  ],
})
export class AuthModule {}
