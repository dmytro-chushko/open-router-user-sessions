import type { PublicUser } from './public-user';

export {};

declare global {
  namespace Express {
    type User = PublicUser;
  }
}
