import { createHmac } from 'node:crypto';

/**
 * Deterministic HMAC-SHA256 hex digest for persisting opaque tokens.
 * Use the same `SESSION_SECRET` value as in `AppConfigService.sessionSecret`.
 */
export function hashOpaqueToken(plainToken: string, secret: string): string {
  if (plainToken.length === 0) {
    throw new Error('Token must not be empty');
  }

  if (secret.length === 0) {
    throw new Error('Token hashing secret must not be empty');
  }

  return createHmac('sha256', secret).update(plainToken).digest('hex');
}
