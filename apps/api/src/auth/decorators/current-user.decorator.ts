import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

/**
 * Resolved `PublicUser` from Passport (`SessionCookieStrategy`) after a successful session.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Express.User | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: Express.User }>();

    return request.user;
  },
);
