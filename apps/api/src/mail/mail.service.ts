import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

import { AppConfigService } from '@/common/app-config.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly appConfig: AppConfigService) {}

  async sendVerificationEmail(input: {
    to: string;
    rawToken: string;
  }): Promise<void> {
    const verifyUrl = `${this.appConfig.webAppUrl}/en/verify-email?token=${encodeURIComponent(input.rawToken)}`;
    const from = this.appConfig.emailFrom;
    const apiKey = this.appConfig.resendApiKey;

    if (apiKey === '') {
      this.logger.warn(
        `[mail dev] RESEND_API_KEY empty — would send verification to ${input.to}: ${verifyUrl}`,
      );

      return;
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: 'Verify your email',
      html: `<p>Click to verify your email:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });

    if (error !== null && error !== undefined) {
      this.logger.error(`Resend verification failed: ${error.message}`, error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(input: {
    to: string;
    rawToken: string;
  }): Promise<void> {
    const resetUrl = `${this.appConfig.webAppUrl}/en/reset-password?token=${encodeURIComponent(input.rawToken)}`;
    const from = this.appConfig.emailFrom;
    const apiKey = this.appConfig.resendApiKey;

    if (apiKey === '') {
      this.logger.warn(
        `[mail dev] RESEND_API_KEY empty — would send password reset to ${input.to}: ${resetUrl}`,
      );

      return;
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: 'Reset your password',
      html: `<p>Click to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    if (error !== null && error !== undefined) {
      this.logger.error(`Resend reset failed: ${error.message}`, error);
      throw new Error('Failed to send password reset email');
    }
  }
}
