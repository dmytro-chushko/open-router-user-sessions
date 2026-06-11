import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
// passport-custom is `export =`; `import Strategy = require` is the correct TS form.
// eslint-disable-next-line @typescript-eslint/no-require-imports -- CommonJS interop for passport-custom
import Strategy = require('passport-custom');

import { SESSION_COOKIE_STRATEGY_NAME } from '@/auth/constants/session-cookie-strategy-name';
import { SessionService } from '@/auth/services/session.service';
import { AppConfigService } from '@/common/app-config.service';
import { UsersService } from '@/user/services/users.service';
import type { PublicUser } from '@/user/types/public-user';

/**
 * Reads HTTP-only session cookie, resolves DB session, loads `PublicUser` for `req.user`.
 * OAuth strategies (Google/GitHub) can be added alongside this name in C1.
 */
@Injectable()
export class SessionCookieStrategy extends PassportStrategy(
  Strategy,
  SESSION_COOKIE_STRATEGY_NAME,
) {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly sessionService: SessionService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async validate(req: Request): Promise<PublicUser> {
    const cookieName = this.appConfig.sessionCookieName;
    const cookies = req.cookies as Record<string, string> | undefined;
    const raw = cookies?.[cookieName];

    if (typeof raw !== 'string' || raw.length === 0) {
      throw new UnauthorizedException('Missing session cookie');
    }

    const session = await this.sessionService.findValidSessionByRawToken(raw);

    if (session === null) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const user = await this.usersService.findPublicById(session.userId);

    if (user === null) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
