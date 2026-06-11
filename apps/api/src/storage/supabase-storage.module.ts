import { Module } from '@nestjs/common';

import { CommonModule } from '@/common/common.module';
import { SupabaseStorageService } from '@/storage/supabase-storage.service';

@Module({
  imports: [CommonModule],
  providers: [SupabaseStorageService],
  exports: [SupabaseStorageService],
})
export class SupabaseStorageModule {}
