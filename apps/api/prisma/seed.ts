import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient, Role } from '../generated/prisma/client';
import { hashPassword } from '../src/auth/crypto/password-hash';

/** Timestamps set in the same DB write can differ by a few ms between fields. */
const CREATED_UPDATED_EQUAL_MS = 5;

function normalizeEmail(rawEmail: string): string {
  return rawEmail.trim().toLowerCase();
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString === undefined || connectionString === '') {
    throw new Error('DATABASE_URL is not set');
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

function isNewlyCreatedUser(user: {
  createdAt: Date;
  updatedAt: Date;
}): boolean {
  return (
    Math.abs(user.updatedAt.getTime() - user.createdAt.getTime()) <
    CREATED_UPDATED_EQUAL_MS
  );
}

async function seedAdmin(prisma: PrismaClient): Promise<void> {
  const email = normalizeEmail(process.env.ADMIN_EMAIL ?? '');
  const password = process.env.ADMIN_SEED_PASSWORD ?? '';

  if (email === '') {
    throw new Error('ADMIN_EMAIL is not set');
  }

  if (password === '') {
    throw new Error('ADMIN_SEED_PASSWORD is not set');
  }

  const passwordHash = await hashPassword(password);
  const now = new Date();

  const result = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      emailVerifiedAt: now,
      role: Role.ADMIN,
      name: 'Admin',
    },
    update: {
      role: Role.ADMIN,
    },
  });

  const action = isNewlyCreatedUser(result)
    ? 'created'
    : 'updated (role ensured)';

  console.log(`Admin seed: ${action} — ${email} (role=${result.role})`);
}

async function main(): Promise<void> {
  if (process.env.ENABLE_ADMIN_SEED !== 'true') {
    console.log('Admin seed skipped (ENABLE_ADMIN_SEED is not "true")');

    return;
  }

  const prisma = createPrismaClient();

  try {
    await seedAdmin(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
