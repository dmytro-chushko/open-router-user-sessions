import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { createOpaqueToken } from '@/auth/crypto/random-token';
import { hashOpaqueToken } from '@/auth/crypto/token-hash';
import { EmailVerificationTokensRepository } from '@/auth/repositories';
import { SessionService } from '@/auth/services/session.service';
import { UsersService } from '@/auth/services/users.service';
import type { PublicUser } from '@/auth/types/public-user';
import { AppConfigService } from '@/common/app-config.service';
import { withErrorHandling } from '@/common/utils/error/error-handler';

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly emailVerificationTokensRepository: EmailVerificationTokensRepository,
    private readonly appConfig: AppConfigService,
  ) {}

  async register(input: {
    email: string;
    password: string;
    name?: string | null;
  }): Promise<PublicUser> {
    return withErrorHandling(
      async () => {
        const email = this.usersService.normalizeEmail(input.email);
        const existing = await this.usersService.findByEmail(email);

        if (existing !== null) {
          throw new ConflictException('Email is already registered');
        }
        const user = await this.usersService.createUserWithPassword({
          email,
          password: input.password,
          name: input.name,
        });
        const rawVerifyToken = createOpaqueToken();
        const verifyHash = hashOpaqueToken(
          rawVerifyToken,
          this.appConfig.sessionSecret,
        );
        const verifyExpiresAt = new Date(
          Date.now() + EMAIL_VERIFICATION_TTL_MS,
        );
        await this.emailVerificationTokensRepository.create({
          userId: user.id,
          tokenHash: verifyHash,
          expiresAt: verifyExpiresAt,
        });
        console.warn(
          '[mail stub] verification email would be sent; token:',
          rawVerifyToken,
        );
        const publicUser = await this.usersService.findPublicById(user.id);

        if (publicUser === null) {
          throw new Error('User missing after registration');
        }

        return publicUser;
      },
      { logger: this.logger, context: 'AuthService.register' },
    );
  }

  async login(input: {
    email: string;
    password: string;
    userAgent?: string | null;
    ip?: string | null;
  }): Promise<{ rawToken: string; expiresAt: Date; user: PublicUser }> {
    return withErrorHandling(
      async () => {
        const user = await this.usersService.findByEmail(input.email);

        if (user === null) {
          throw new UnauthorizedException('Invalid credentials');
        }

        if (user.emailVerifiedAt === null) {
          throw new ForbiddenException('Email not verified');
        }
        const passwordOk = await this.usersService.verifyPasswordForUser(
          user,
          input.password,
        );

        if (!passwordOk) {
          throw new UnauthorizedException('Invalid credentials');
        }
        const { rawToken, expiresAt } = await this.sessionService.createSession(
          {
            userId: user.id,
            userAgent: input.userAgent,
            ip: input.ip,
          },
        );
        const publicUser = await this.usersService.findPublicById(user.id);

        if (publicUser === null) {
          throw new UnauthorizedException('Invalid credentials');
        }

        return { rawToken, expiresAt, user: publicUser };
      },
      { logger: this.logger, context: 'AuthService.login' },
    );
  }

  async logout(rawToken: string): Promise<void> {
    return withErrorHandling(
      async () => {
        await this.sessionService.deleteSessionByRawToken(rawToken);
      },
      { logger: this.logger, context: 'AuthService.logout' },
    );
  }

  async getMe(userId: string): Promise<PublicUser | null> {
    return withErrorHandling(
      async () => this.usersService.findPublicById(userId),
      { logger: this.logger, context: 'AuthService.getMe' },
    );
  }
}
