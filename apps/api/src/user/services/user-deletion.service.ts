import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { USER_DELETION_ERROR_MESSAGES } from '@repo/api-contracts';

import { withErrorHandling } from '@/common/utils/error/error-handler';
import { UserAvatarService } from '@/user/services/user-avatar.service';
import { UsersService } from '@/user/services/users.service';

@Injectable()
export class UserDeletionService {
  private readonly logger = new Logger(UserDeletionService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly userAvatarService: UserAvatarService,
  ) {}

  deleteAccount(input: {
    userId: string;
    emailConfirmation: string;
    currentPassword?: string;
  }): Promise<void> {
    return withErrorHandling(
      async () => {
        const user = await this.usersService.findById(input.userId);

        if (user === null) {
          throw new NotFoundException('User not found.');
        }

        if (user.role === 'ADMIN') {
          throw new ForbiddenException(
            USER_DELETION_ERROR_MESSAGES.ADMIN_CANNOT_DELETE,
          );
        }

        const normalizedEmail = this.usersService.normalizeEmail(
          input.emailConfirmation,
        );

        if (normalizedEmail !== user.email) {
          throw new BadRequestException(
            USER_DELETION_ERROR_MESSAGES.EMAIL_MISMATCH,
          );
        }

        const hasPassword =
          user.passwordHash !== null && user.passwordHash.length > 0;

        if (hasPassword) {
          if (
            input.currentPassword === undefined ||
            input.currentPassword.length === 0
          ) {
            throw new BadRequestException(
              USER_DELETION_ERROR_MESSAGES.CURRENT_PASSWORD_REQUIRED,
            );
          }

          const isValid = await this.usersService.verifyPasswordForUser(
            user,
            input.currentPassword,
          );

          if (!isValid) {
            throw new BadRequestException(
              USER_DELETION_ERROR_MESSAGES.INVALID_PASSWORD,
            );
          }
        }

        await this.userAvatarService.cleanupManagedAvatarForUser(input.userId);
        await this.usersService.deleteById(input.userId);
      },
      { logger: this.logger, context: 'UserDeletionService.deleteAccount' },
    );
  }
}
