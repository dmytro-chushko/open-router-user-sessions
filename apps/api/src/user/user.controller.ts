import { Controller, Req, UnauthorizedException } from '@nestjs/common';
import { userContract } from '@repo/api-contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import type { Request } from 'express';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AppConfigService } from '@/common/app-config.service';
import type { AvatarContentType } from '@/storage/storage.constants';
import { UserAvatarService } from '@/user/services/user-avatar.service';
import { UserProfileService } from '@/user/services/user-profile.service';
import type { PublicUser } from '@/user/types/public-user';

@Controller()
export class UserController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly userAvatarService: UserAvatarService,
    private readonly appConfig: AppConfigService,
  ) {}

  @TsRestHandler(userContract.me)
  me(@CurrentUser() user: PublicUser | undefined) {
    return tsRestHandler(userContract.me, async () => {
      const currentUser = this.requireUser(user);

      return {
        status: 200 as const,
        body: await this.userProfileService.getMeWithProviders(currentUser.id),
      };
    });
  }

  @TsRestHandler(userContract.updateMe)
  updateMe(@CurrentUser() user: PublicUser | undefined) {
    return tsRestHandler(userContract.updateMe, async ({ body }) => {
      const currentUser = this.requireUser(user);

      return {
        status: 200 as const,
        body: await this.userProfileService.updateName(
          currentUser.id,
          body.name,
        ),
      };
    });
  }

  @TsRestHandler(userContract.changePassword)
  changePassword(
    @CurrentUser() user: PublicUser | undefined,
    @Req() req: Request,
  ) {
    return tsRestHandler(userContract.changePassword, async ({ body }) => {
      const currentUser = this.requireUser(user);
      const keepSessionRawToken = this.readSessionCookie(req);

      if (keepSessionRawToken === null) {
        throw new UnauthorizedException();
      }

      await this.userProfileService.changePassword({
        userId: currentUser.id,
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
        keepSessionRawToken,
      });

      return { status: 200 as const, body: { ok: true as const } };
    });
  }

  @TsRestHandler(userContract.avatarUploadIntent)
  avatarUploadIntent(@CurrentUser() user: PublicUser | undefined) {
    return tsRestHandler(userContract.avatarUploadIntent, async ({ body }) => {
      const currentUser = this.requireUser(user);

      return {
        status: 200 as const,
        body: await this.userAvatarService.createUploadIntent(currentUser.id, {
          contentType: body.contentType as AvatarContentType,
          contentLength: body.contentLength,
        }),
      };
    });
  }

  @TsRestHandler(userContract.avatarConfirm)
  avatarConfirm(@CurrentUser() user: PublicUser | undefined) {
    return tsRestHandler(userContract.avatarConfirm, async ({ body }) => {
      const currentUser = this.requireUser(user);

      return {
        status: 200 as const,
        body: await this.userAvatarService.confirmUpload(
          currentUser.id,
          body.path,
        ),
      };
    });
  }

  @TsRestHandler(userContract.avatarDelete)
  avatarDelete(@CurrentUser() user: PublicUser | undefined) {
    return tsRestHandler(userContract.avatarDelete, async () => {
      const currentUser = this.requireUser(user);

      return {
        status: 200 as const,
        body: await this.userAvatarService.deleteAvatar(currentUser.id),
      };
    });
  }

  private requireUser(user: PublicUser | undefined): PublicUser {
    if (user === undefined) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private readSessionCookie(req: Request): string | null {
    const cookies = req.cookies as Record<string, string> | undefined;
    const raw = cookies?.[this.appConfig.sessionCookieName];

    return typeof raw === 'string' && raw.length > 0 ? raw : null;
  }
}
