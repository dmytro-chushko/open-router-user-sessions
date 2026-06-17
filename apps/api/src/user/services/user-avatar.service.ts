import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { AppConfigService } from '@/common/app-config.service';
import { withErrorHandling } from '@/common/utils/error/error-handler';
import type { AvatarContentType } from '@/storage/storage.constants';
import {
  extractStoragePathFromPublicUrl,
  isManagedAvatarPublicUrl,
} from '@/storage/storage.utils';
import { SupabaseStorageService } from '@/storage/supabase-storage.service';
import { UserProfileService } from '@/user/services/user-profile.service';
import { UsersService } from '@/user/services/users.service';
import type { UserMe } from '@/user/types/user-me';

@Injectable()
export class UserAvatarService {
  private readonly logger = new Logger(UserAvatarService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly userProfileService: UserProfileService,
    private readonly supabaseStorageService: SupabaseStorageService,
    private readonly appConfig: AppConfigService,
  ) {}

  createUploadIntent(
    userId: string,
    input: { contentType: AvatarContentType; contentLength: number },
  ) {
    return withErrorHandling(
      () => this.supabaseStorageService.createAvatarUploadIntent(userId, input),
      {
        logger: this.logger,
        context: 'UserAvatarService.createUploadIntent',
      },
    );
  }

  confirmUpload(userId: string, path: string): Promise<UserMe> {
    return withErrorHandling(
      async () => {
        this.supabaseStorageService.assertPathOwnedByUser(path, userId);
        await this.supabaseStorageService.readAvatarMetadata(path);

        const user = await this.usersService.findPublicById(userId);

        if (user === null) {
          throw new NotFoundException('User not found.');
        }

        await this.deleteManagedAvatarIfPresent(user.avatar);

        const publicUrl = this.supabaseStorageService.getPublicUrl(path);
        await this.usersService.updateAvatar(userId, publicUrl);

        return this.userProfileService.getMeWithProviders(userId);
      },
      { logger: this.logger, context: 'UserAvatarService.confirmUpload' },
    );
  }

  deleteAvatar(userId: string): Promise<UserMe> {
    return withErrorHandling(
      async () => {
        const user = await this.usersService.findPublicById(userId);

        if (user === null) {
          throw new NotFoundException('User not found.');
        }

        if (user.avatar === null) {
          return this.userProfileService.getMeWithProviders(userId);
        }

        await this.deleteManagedAvatarIfPresent(user.avatar);
        await this.usersService.updateAvatar(userId, null);

        return this.userProfileService.getMeWithProviders(userId);
      },
      { logger: this.logger, context: 'UserAvatarService.deleteAvatar' },
    );
  }

  cleanupManagedAvatarForUser(userId: string): Promise<void> {
    return withErrorHandling(
      async () => {
        const user = await this.usersService.findPublicById(userId);

        if (user === null) {
          return;
        }

        await this.deleteManagedAvatarIfPresent(user.avatar);
      },
      {
        logger: this.logger,
        context: 'UserAvatarService.cleanupManagedAvatarForUser',
      },
    );
  }

  private async deleteManagedAvatarIfPresent(
    avatarUrl: string | null,
  ): Promise<void> {
    if (
      !isManagedAvatarPublicUrl(
        avatarUrl,
        this.appConfig.supabaseUrl,
        this.appConfig.supabaseStorageBucket,
      )
    ) {
      return;
    }

    const path = extractStoragePathFromPublicUrl(
      avatarUrl ?? '',
      this.appConfig.supabaseUrl,
      this.appConfig.supabaseStorageBucket,
    );

    if (path === null) {
      throw new BadRequestException('Invalid stored avatar URL.');
    }

    await this.supabaseStorageService.deleteObject(path);
  }
}
