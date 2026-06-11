import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AppConfigService } from '@/common/app-config.service';
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
    return this.supabaseStorageService.createAvatarUploadIntent(userId, input);
  }

  async confirmUpload(userId: string, path: string): Promise<UserMe> {
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
  }

  async deleteAvatar(userId: string): Promise<UserMe> {
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
