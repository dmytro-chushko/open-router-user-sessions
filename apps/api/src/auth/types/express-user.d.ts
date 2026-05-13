import type { PublicUser } from './public-user';

declare global {
  namespace Express {
    /** Populated by Passport after `SessionCookieStrategy` succeeds. */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends PublicUser {}
  }
}

export {};
