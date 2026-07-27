import { ADMIN_USERS_ERROR_MESSAGES } from "@repo/api-contracts";

type AdminUsersErrorTranslator = {
  (key: "cannotChangeOwnRole"): string;
  (key: "cannotDemoteLastAdmin"): string;
  (key: "cannotDeleteSelf"): string;
  (key: "cannotDeleteLastAdmin"): string;
  (key: "generic"): string;
};

export function mapAdminUsersApiError(
  apiMessage: string,
  t: AdminUsersErrorTranslator,
): string {
  const messageMap: Record<string, string> = {
    [ADMIN_USERS_ERROR_MESSAGES.CANNOT_CHANGE_OWN_ROLE]: t(
      "cannotChangeOwnRole",
    ),
    [ADMIN_USERS_ERROR_MESSAGES.CANNOT_DEMOTE_LAST_ADMIN]: t(
      "cannotDemoteLastAdmin",
    ),
    [ADMIN_USERS_ERROR_MESSAGES.CANNOT_DELETE_SELF]: t("cannotDeleteSelf"),
    [ADMIN_USERS_ERROR_MESSAGES.CANNOT_DELETE_LAST_ADMIN]: t(
      "cannotDeleteLastAdmin",
    ),
  };

  return messageMap[apiMessage] ?? t("generic");
}
