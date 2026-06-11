import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { EmailVerificationService } from '@/auth/services/email-verification.service';
import { SessionService } from '@/auth/services/session.service';
import { withErrorHandling } from '@/common/utils/error/error-handler';
import { UsersService } from '@/user/services/users.service';
import type { PublicUser } from '@/user/types/public-user';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly emailVerificationService: EmailVerificationService,
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
        await this.emailVerificationService.createAndSendForNewUser({
          userId: user.id,
          email: user.email,
        });
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
}
