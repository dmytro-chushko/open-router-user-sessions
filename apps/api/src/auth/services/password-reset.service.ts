import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { hashPassword } from '@/auth/crypto/password-hash';
import { createOpaqueToken } from '@/auth/crypto/random-token';
import { hashOpaqueToken } from '@/auth/crypto/token-hash';
import { PasswordResetTokensRepository } from '@/auth/repositories/password-reset-tokens.repository';
import { SessionService } from '@/auth/services/session.service';
import { AppConfigService } from '@/common/app-config.service';
import { withErrorHandling } from '@/common/utils/error/error-handler';
import { MailService } from '@/mail/mail.service';
import { UsersService } from '@/user/services/users.service';

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 90 * 1000;

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly passwordResetTokensRepository: PasswordResetTokensRepository,
    private readonly sessionService: SessionService,
    private readonly appConfig: AppConfigService,
  ) {}

  async requestReset(email: string): Promise<void> {
    return withErrorHandling(
      async () => {
        const normalized = this.usersService.normalizeEmail(email);
        const user = await this.usersService.findByEmail(normalized);

        if (user === null) {
          return;
        }
        await this.createTokenAndSendEmail(user.id, user.email);
      },
      { logger: this.logger, context: 'PasswordResetService.requestReset' },
    );
  }

  async resetPassword(input: {
    rawToken: string;
    newPassword: string;
  }): Promise<void> {
    return withErrorHandling(
      async () => {
        if (input.rawToken.length === 0) {
          throw new BadRequestException('Token is required');
        }

        if (input.newPassword.length === 0) {
          throw new BadRequestException('Password is required');
        }
        const tokenHash = hashOpaqueToken(
          input.rawToken,
          this.appConfig.sessionSecret,
        );
        const row =
          await this.passwordResetTokensRepository.findActiveByTokenHash(
            tokenHash,
          );

        if (row === null) {
          throw new BadRequestException('Invalid or expired reset token');
        }
        const passwordHash = await hashPassword(input.newPassword);
        await this.usersService.updatePasswordHash(row.userId, passwordHash);
        await this.passwordResetTokensRepository.markConsumed(row.id);
        await this.sessionService.deleteAllSessionsForUser(row.userId);
      },
      { logger: this.logger, context: 'PasswordResetService.resetPassword' },
    );
  }

  async resendReset(email: string): Promise<void> {
    return withErrorHandling(
      async () => {
        const normalized = this.usersService.normalizeEmail(email);
        const user = await this.usersService.findByEmail(normalized);

        if (user === null) {
          return;
        }
        const latest =
          await this.passwordResetTokensRepository.findLatestByUserId(user.id);

        if (
          latest !== null &&
          Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_MS
        ) {
          throw new HttpException(
            'Please wait before requesting another email',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        await this.createTokenAndSendEmail(user.id, user.email);
      },
      { logger: this.logger, context: 'PasswordResetService.resendReset' },
    );
  }

  private async createTokenAndSendEmail(
    userId: string,
    email: string,
  ): Promise<void> {
    await this.passwordResetTokensRepository.deleteManyUnconsumedByUserId(
      userId,
    );
    const rawToken = createOpaqueToken();
    const tokenHash = hashOpaqueToken(rawToken, this.appConfig.sessionSecret);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
    await this.passwordResetTokensRepository.create({
      userId,
      tokenHash,
      expiresAt,
    });
    await this.mailService.sendPasswordResetEmail({ to: email, rawToken });
  }
}
