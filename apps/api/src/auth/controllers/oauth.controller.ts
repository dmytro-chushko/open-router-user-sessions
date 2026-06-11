import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

import { GITHUB_OAUTH_STRATEGY_NAME } from '@/auth/constants/github-oauth-strategy-name';
import { GOOGLE_OAUTH_STRATEGY_NAME } from '@/auth/constants/google-oauth-strategy-name';
import { Public } from '@/auth/decorators/public.decorator';
import { buildSessionCookieOptions } from '@/auth/helpers/session-cookie';
import { SessionService } from '@/auth/services/session.service';
import { AppConfigService } from '@/common/app-config.service';
import type { PublicUser } from '@/user/types/public-user';

@Public()
@Controller('auth')
export class OAuthController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly appConfig: AppConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard(GOOGLE_OAUTH_STRATEGY_NAME))
  googleStart(): void {
    // Passport redirects to Google.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard(GOOGLE_OAUTH_STRATEGY_NAME))
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.finishOAuthLogin(req, res);
  }

  @Get('github')
  @UseGuards(AuthGuard(GITHUB_OAUTH_STRATEGY_NAME))
  githubStart(): void {
    // Passport redirects to GitHub.
  }

  @Get('github/callback')
  @UseGuards(AuthGuard(GITHUB_OAUTH_STRATEGY_NAME))
  async githubCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.finishOAuthLogin(req, res);
  }

  private async finishOAuthLogin(req: Request, res: Response): Promise<void> {
    const user = req.user as PublicUser | undefined;

    if (user === undefined) {
      res.redirect(`${this.appConfig.webAppUrl}/en/login?oauth=error`);

      return;
    }

    const userAgent = req.headers['user-agent'];
    const ip =
      typeof req.ip === 'string' && req.ip.length > 0 ? req.ip : undefined;

    const { rawToken, expiresAt } = await this.sessionService.createSession({
      userId: user.id,
      userAgent: typeof userAgent === 'string' ? userAgent : null,
      ip: ip ?? null,
    });

    res.cookie(
      this.appConfig.sessionCookieName,
      rawToken,
      buildSessionCookieOptions(this.appConfig, expiresAt),
    );

    res.redirect(`${this.appConfig.webAppUrl}/en/dashboard`);
  }
}
