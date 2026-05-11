import { Module } from '@nestjs/common';

import { AppConfigService } from '@/common/app-config.service';

@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class CommonModule {}
