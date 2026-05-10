import { randomBytes } from 'node:crypto';

const OPAQUE_TOKEN_BYTES = 32;

/**
 * Cryptographically strong opaque token (e.g. session, email verify, password reset).
 * Store only `hashOpaqueToken(raw, secret)` in the database, never the raw value.
 */
export function createOpaqueToken(): string {
  return randomBytes(OPAQUE_TOKEN_BYTES).toString('base64url');
}
