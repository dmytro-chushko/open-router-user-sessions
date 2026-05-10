import * as bcrypt from 'bcrypt';

const BCRYPT_COST = 12;

/**
 * Produces a bcrypt hash suitable for storing in `User.passwordHash`.
 */
export async function hashPassword(plain: string): Promise<string> {
  if (plain.length === 0) {
    throw new Error('Password must not be empty');
  }

  return bcrypt.hash(plain, BCRYPT_COST);
}

/**
 * Returns whether `plain` matches a previously stored bcrypt `hash`.
 */
export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  if (plain.length === 0 || hash.length === 0) {
    return false;
  }

  return bcrypt.compare(plain, hash);
}
