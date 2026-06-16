export const USER_DELETION_ERROR_MESSAGES = {
  EMAIL_MISMATCH: "Email does not match your account.",
  CURRENT_PASSWORD_REQUIRED: "Current password is required.",
  INVALID_PASSWORD: "Current password is incorrect.",
  ADMIN_CANNOT_DELETE:
    "Administrator accounts cannot be self-deleted. Contact support if you need to close this account.",
} as const;

export type UserDeletionErrorMessage =
  (typeof USER_DELETION_ERROR_MESSAGES)[keyof typeof USER_DELETION_ERROR_MESSAGES];
