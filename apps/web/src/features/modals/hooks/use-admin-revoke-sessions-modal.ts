"use client";

import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";

import { useAdminRevokeSessionsMutation } from "@/entities/admin/api/use-admin-revoke-sessions-mutation";
import { mapAdminUsersApiError } from "@/features/admin/lib/map-admin-users-api-error";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { useModal } from "@/shared/modal/use-modal";

export function useAdminRevokeSessionsModal() {
  const t = useTranslations("protected.admin.actions");
  const tErrors = useTranslations("protected.admin.errors");
  const { isOpen, payload, close } = useModal("admin-revoke-sessions");
  const revokeSessionsMutation = useAdminRevokeSessionsMutation();
  const isPending = revokeSessionsMutation.isPending;

  const handleRevoke = async () => {
    if (payload === undefined) {
      return;
    }

    try {
      await revokeSessionsMutation.mutateAsync({ userId: payload.userId });
      toast.success(t("revokeSessionsSuccess"));
      close();
    } catch (error) {
      const apiMessage =
        error instanceof ApiRequestError ? error.message : undefined;
      const message =
        apiMessage !== undefined
          ? mapAdminUsersApiError(apiMessage, tErrors)
          : error instanceof Error
            ? error.message
            : tErrors("generic");
      toast.error(message);
    }
  };

  return {
    isOpen,
    payload,
    close,
    isPending,
    handleRevoke,
    t,
  };
}
