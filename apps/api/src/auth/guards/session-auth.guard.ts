import { type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { SESSION_COOKIE_STRATEGY_NAME } from '@/auth/constants/session-cookie-strategy-name';
import { IS_PUBLIC_KEY } from '@/auth/decorators/public.decorator';

/**
 * Global default: session cookie + Passport. Skip with `@Public()` on route/controller.
 */
@Injectable()
export class SessionAuthGuard extends AuthGuard(SESSION_COOKIE_STRATEGY_NAME) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic === true) {
      return true;
    }

    return super.canActivate(context);
  }
}
