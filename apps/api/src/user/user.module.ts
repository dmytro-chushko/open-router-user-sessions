import { Module } from '@nestjs/common';

import { CommonModule } from '@/common/common.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { SupabaseStorageModule } from '@/storage/supabase-storage.module';
import { AccountsRepository, UsersRepository } from '@/user/repositories';
import {
  UserAvatarService,
  UserProfileService,
  UsersService,
} from '@/user/services';
import { UserController } from '@/user/user.controller';

@Module({
  imports: [PrismaModule, CommonModule, SupabaseStorageModule],
  controllers: [UserController],
  providers: [
    UsersRepository,
    AccountsRepository,
    UsersService,
    UserProfileService,
    UserAvatarService,
  ],
  exports: [UsersRepository, AccountsRepository, UsersService],
})
export class UserModule {}
