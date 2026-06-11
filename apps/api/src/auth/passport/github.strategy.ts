import { Provider } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile } from 'passport-github2';

import { GITHUB_OAUTH_STRATEGY_NAME } from '@/auth/constants/github-oauth-strategy-name';
import { OAuthService } from '@/auth/services/oauth.service';
import { AppConfigService } from '@/common/app-config.service';
import type { PublicUser } from '@/user/types/public-user';

@Injectable()
export class GitHubStrategy extends PassportStrategy(
  Strategy,
  GITHUB_OAUTH_STRATEGY_NAME,
) {
  constructor(
    appConfig: AppConfigService,
    private readonly oauthService: OAuthService,
  ) {
    const github = appConfig.githubOAuth;
    super({
      clientID: github.clientId,
      clientSecret: github.clientSecret,
      callbackURL: github.callbackUrl,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<PublicUser> {
    const email = profile.emails?.[0]?.value;

    if (email === undefined || email.length === 0) {
      throw new Error('GitHub account has no public email; grant user:email');
    }

    return this.oauthService.findOrCreateUserFromOAuthProfile({
      provider: Provider.GITHUB,
      providerAccountId: String(profile.id),
      email,
      name: profile.displayName ?? profile.username ?? null,
      avatar: profile.photos?.[0]?.value ?? null,
      emailVerified: true,
      accessToken,
      refreshToken,
    });
  }
}
