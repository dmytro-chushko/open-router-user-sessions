import { Provider } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Profile } from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';

import { GOOGLE_OAUTH_STRATEGY_NAME } from '@/auth/constants/google-oauth-strategy-name';
import { OAuthService } from '@/auth/services/oauth.service';
import type { PublicUser } from '@/auth/types/public-user';
import { AppConfigService } from '@/common/app-config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  GOOGLE_OAUTH_STRATEGY_NAME,
) {
  constructor(
    appConfig: AppConfigService,
    private readonly oauthService: OAuthService,
  ) {
    const google = appConfig.googleOAuth;
    super({
      clientID: google.clientId,
      clientSecret: google.clientSecret,
      callbackURL: google.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<PublicUser> {
    const email = profile.emails?.[0]?.value;

    if (email === undefined || email.length === 0) {
      throw new Error('Google account has no email');
    }

    const emailVerified = profile.emails?.[0]?.verified === true;

    return this.oauthService.findOrCreateUserFromOAuthProfile({
      provider: Provider.GOOGLE,
      providerAccountId: profile.id,
      email,
      name: profile.displayName ?? null,
      avatar: profile.photos?.[0]?.value ?? null,
      emailVerified,
      accessToken,
      refreshToken,
    });
  }
}
