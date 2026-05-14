import { Module } from '@nestjs/common';

import { CommonModule } from '@/common/common.module';
import { MailService } from '@/mail/mail.service';

@Module({
  imports: [CommonModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
