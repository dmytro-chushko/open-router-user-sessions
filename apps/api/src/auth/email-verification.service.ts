import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { createOpaqueToken } from '@/auth/crypto/random-token';
import { hashOpaqueToken } from '@/auth/crypto/token-hash';
import { EmailVerificationTokensRepository } from '@/auth/repositories';
import { UsersService } from '@/auth/services/users.service';
import { AppConfigService } from '@/common/app-config.service';
import { withErrorHandling } from '@/common/utils/error/error-handler';
import { MailService } from '@/mail/mail.service';

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 90 * 1000;

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly emailVerificationTokensRepository: EmailVerificationTokensRepository,
    private readonly appConfig: AppConfigService,
  ) {}

  async createAndSendForNewUser(input: {
    userId: string;
    email: string;
  }): Promise<void> {
    return withErrorHandling(
      async () => {
        await this.emailVerificationTokensRepository.deleteManyUnconsumedByUserId(
          input.userId,
        );
        const rawToken = createOpaqueToken();
        const tokenHash = hashOpaqueToken(
          rawToken,
          this.appConfig.sessionSecret,
        );
        const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
        await this.emailVerificationTokensRepository.create({
          userId: input.userId,
          tokenHash,
          expiresAt,
        });
        await this.mailService.sendVerificationEmail({
          to: input.email,
          rawToken,
        });
      },
      { logger: this.logger, context: 'EmailVerificationService.create' },
    );
  }

  async verifyEmail(rawToken: string): Promise<void> {
    return withErrorHandling(
      async () => {
        if (rawToken.length === 0) {
          throw new BadRequestException('Token is required');
        }
        const tokenHash = hashOpaqueToken(
          rawToken,
          this.appConfig.sessionSecret,
        );
        const row =
          await this.emailVerificationTokensRepository.findActiveByTokenHash(
            tokenHash,
          );

        if (row === null) {
          throw new BadRequestException(
            'Invalid or expired verification token',
          );
        }
        await this.usersService.setEmailVerified(row.userId, new Date());
        await this.emailVerificationTokensRepository.markConsumed(row.id);
      },
      { logger: this.logger, context: 'EmailVerificationService.verifyEmail' },
    );
  }

  async resendVerification(email: string): Promise<void> {
    return withErrorHandling(
      async () => {
        const normalized = this.usersService.normalizeEmail(email);
        const user = await this.usersService.findByEmail(normalized);

        if (user === null) {
          return;
        }

        if (user.emailVerifiedAt !== null) {
          return;
        }
        const latest =
          await this.emailVerificationTokensRepository.findLatestByUserId(
            user.id,
          );

        if (
          latest !== null &&
          Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_MS
        ) {
          throw new HttpException(
            'Please wait before requesting another email',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        await this.emailVerificationTokensRepository.deleteManyUnconsumedByUserId(
          user.id,
        );
        const rawToken = createOpaqueToken();
        const tokenHash = hashOpaqueToken(
          rawToken,
          this.appConfig.sessionSecret,
        );
        const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
        await this.emailVerificationTokensRepository.create({
          userId: user.id,
          tokenHash,
          expiresAt,
        });
        await this.mailService.sendVerificationEmail({
          to: user.email,
          rawToken,
        });
      },
      { logger: this.logger, context: 'EmailVerificationService.resend' },
    );
  }
}
