import type { Session } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';

import { createOpaqueToken } from '@/auth/crypto/random-token';
import { hashOpaqueToken } from '@/auth/crypto/token-hash';
import { SessionsRepository } from '@/auth/repositories';
import { AppConfigService } from '@/common/app-config.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly appConfig: AppConfigService,
  ) {}

  async createSession(input: {
    userId: string;
    userAgent?: string | null;
    ip?: string | null;
  }): Promise<{ rawToken: string; expiresAt: Date }> {
    const rawToken = createOpaqueToken();
    const tokenHash = hashOpaqueToken(rawToken, this.appConfig.sessionSecret);
    const maxAgeSeconds = this.appConfig.sessionCookieMaxAge;
    const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);
    await this.sessionsRepository.create({
      tokenHash,
      userId: input.userId,
      userAgent: input.userAgent,
      ipAddress: input.ip,
      expiresAt,
    });

    return { rawToken, expiresAt };
  }

  async findValidSessionByRawToken(rawToken: string): Promise<Session | null> {
    const tokenHash = hashOpaqueToken(rawToken, this.appConfig.sessionSecret);
    const session = await this.sessionsRepository.findByTokenHash(tokenHash);

    if (session === null) {
      return null;
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      return null;
    }

    return session;
  }

  async deleteSessionByRawToken(rawToken: string): Promise<void> {
    const tokenHash = hashOpaqueToken(rawToken, this.appConfig.sessionSecret);
    await this.sessionsRepository.deleteByTokenHash(tokenHash);
  }

  async deleteAllSessionsForUser(userId: string): Promise<number> {
    return this.sessionsRepository.deleteAllForUser(userId);
  }
}
