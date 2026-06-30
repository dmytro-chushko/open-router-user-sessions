export const ADMIN_USERS_ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found.",
  CANNOT_CHANGE_OWN_ROLE: "You cannot change your own role.",
  CANNOT_DEMOTE_LAST_ADMIN: "Cannot remove the last administrator.",
  CANNOT_DELETE_SELF:
    "You cannot delete your own account from the admin panel.",
  CANNOT_DELETE_LAST_ADMIN: "Cannot delete the last administrator.",
} as const;

export type AdminUsersErrorMessage =
  (typeof ADMIN_USERS_ERROR_MESSAGES)[keyof typeof ADMIN_USERS_ERROR_MESSAGES];
