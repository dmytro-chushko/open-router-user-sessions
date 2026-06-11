import { Controller, Req, Res } from '@nestjs/common';
import { authContract } from '@repo/api-contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import type { Request, Response } from 'express';

import { Public } from '@/auth/decorators/public.decorator';
import {
  buildClearSessionCookieOptions,
  buildSessionCookieOptions,
} from '@/auth/helpers/session-cookie';
import { AuthService } from '@/auth/services/auth.service';
import { EmailVerificationService } from '@/auth/services/email-verification.service';
import { PasswordResetService } from '@/auth/services/password-reset.service';
import { AppConfigService } from '@/common/app-config.service';

@Controller()
export class AuthContractController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly passwordResetService: PasswordResetService,
    private readonly appConfig: AppConfigService,
  ) {}

  @Public()
  @TsRestHandler(authContract.register)
  register() {
    return tsRestHandler(authContract.register, async ({ body }) => {
      const user = await this.authService.register({
        email: body.email,
        password: body.password,
        name: body.name,
      });

      return { status: 201 as const, body: user };
    });
  }

  @Public()
  @TsRestHandler(authContract.login)
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return tsRestHandler(authContract.login, async ({ body }) => {
      const userAgent = req.headers['user-agent'];
      const { rawToken, expiresAt, user } = await this.authService.login({
        email: body.email,
        password: body.password,
        userAgent: typeof userAgent === 'string' ? userAgent : null,
        ip: req.ip ?? null,
      });

      res.cookie(
        this.appConfig.sessionCookieName,
        rawToken,
        buildSessionCookieOptions(this.appConfig, expiresAt),
      );

      return { status: 200 as const, body: { user } };
    });
  }

  @TsRestHandler(authContract.logout)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return tsRestHandler(authContract.logout, async () => {
      const rawToken = this.readSessionCookie(req);

      if (rawToken !== null) {
        await this.authService.logout(rawToken);
      }

      res.clearCookie(
        this.appConfig.sessionCookieName,
        buildClearSessionCookieOptions(this.appConfig),
      );

      return { status: 204 as const, body: undefined };
    });
  }

  @Public()
  @TsRestHandler(authContract.verifyEmail)
  verifyEmail() {
    return tsRestHandler(authContract.verifyEmail, async ({ body }) => {
      await this.emailVerificationService.verifyEmail(body.token);

      return { status: 200 as const, body: { ok: true as const } };
    });
  }

  @Public()
  @TsRestHandler(authContract.resendVerification)
  resendVerification() {
    return tsRestHandler(authContract.resendVerification, async ({ body }) => {
      await this.emailVerificationService.resendVerification(body.email);

      return { status: 200 as const, body: { ok: true as const } };
    });
  }

  @Public()
  @TsRestHandler(authContract.forgotPassword)
  forgotPassword() {
    return tsRestHandler(authContract.forgotPassword, async ({ body }) => {
      await this.passwordResetService.requestReset(body.email);

      return { status: 200 as const, body: { ok: true as const } };
    });
  }

  @Public()
  @TsRestHandler(authContract.resetPassword)
  resetPassword() {
    return tsRestHandler(authContract.resetPassword, async ({ body }) => {
      await this.passwordResetService.resetPassword({
        rawToken: body.token,
        newPassword: body.newPassword,
      });

      return { status: 200 as const, body: { ok: true as const } };
    });
  }

  @Public()
  @TsRestHandler(authContract.resendPasswordReset)
  resendPasswordReset() {
    return tsRestHandler(authContract.resendPasswordReset, async ({ body }) => {
      await this.passwordResetService.resendReset(body.email);

      return { status: 200 as const, body: { ok: true as const } };
    });
  }

  private readSessionCookie(req: Request): string | null {
    const cookies = req.cookies as Record<string, string> | undefined;
    const raw = cookies?.[this.appConfig.sessionCookieName];

    return typeof raw === 'string' && raw.length > 0 ? raw : null;
  }
}
