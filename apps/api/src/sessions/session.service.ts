import type { Session } from '@generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';

import { createOpaqueToken } from '@/auth/crypto/random-token';
import { hashOpaqueToken } from '@/auth/crypto/token-hash';
import { AppConfigService } from '@/common/app-config.service';
import { withErrorHandling } from '@/common/utils/error/error-handler';
import { SessionsRepository } from '@/sessions/sessions.repository';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly appConfig: AppConfigService,
  ) {}

  async createSession(input: {
    userId: string;
    userAgent?: string | null;
    ip?: string | null;
  }): Promise<{ rawToken: string; expiresAt: Date }> {
    return withErrorHandling(
      async () => {
        const rawToken = createOpaqueToken();
        const tokenHash = hashOpaqueToken(
          rawToken,
          this.appConfig.sessionSecret,
        );
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
      },
      { logger: this.logger, context: 'SessionService.createSession' },
    );
  }

  async findValidSessionByRawToken(rawToken: string): Promise<Session | null> {
    return withErrorHandling(
      async () => {
        const tokenHash = hashOpaqueToken(
          rawToken,
          this.appConfig.sessionSecret,
        );
        const session =
          await this.sessionsRepository.findByTokenHash(tokenHash);

        if (session === null) {
          return null;
        }

        if (session.expiresAt.getTime() <= Date.now()) {
          return null;
        }

        return session;
      },
      {
        logger: this.logger,
        context: 'SessionService.findValidSessionByRawToken',
      },
    );
  }

  async deleteSessionByRawToken(rawToken: string): Promise<void> {
    return withErrorHandling(
      async () => {
        const tokenHash = hashOpaqueToken(
          rawToken,
          this.appConfig.sessionSecret,
        );
        await this.sessionsRepository.deleteByTokenHash(tokenHash);
      },
      {
        logger: this.logger,
        context: 'SessionService.deleteSessionByRawToken',
      },
    );
  }

  async deleteAllSessionsForUser(userId: string): Promise<number> {
    return withErrorHandling(
      async () => this.sessionsRepository.deleteAllForUser(userId),
      {
        logger: this.logger,
        context: 'SessionService.deleteAllSessionsForUser',
      },
    );
  }

  async deleteAllSessionsForUserExceptRawToken(
    userId: string,
    keepRawToken: string,
  ): Promise<number> {
    return withErrorHandling(
      async () => {
        const exceptTokenHash = hashOpaqueToken(
          keepRawToken,
          this.appConfig.sessionSecret,
        );

        return this.sessionsRepository.deleteAllForUserExceptTokenHash(
          userId,
          exceptTokenHash,
        );
      },
      {
        logger: this.logger,
        context: 'SessionService.deleteAllSessionsForUserExceptRawToken',
      },
    );
  }
}
