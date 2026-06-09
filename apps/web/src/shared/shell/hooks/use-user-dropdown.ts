"use client";

import { toast } from "@repo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { currentUserQueryKey, useLogoutMutation } from "@/entities/auth";
import { useRouter } from "@/i18n/navigation";
import { ApiRequestError } from "@/shared/api/api-request-error";

export function useUserDropdown() {
  const t = useTranslations("header");
  const tCommon = useTranslations("auth.common");
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      queryClient.setQueryData(currentUserQueryKey, null);
      toast.success(t("logOutSuccess"));
      router.push("/");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : tCommon("unknownError");
      toast.error(message);
    }
  };

  return {
    handleLogout,
    isLoggingOut: logoutMutation.isPending,
  };
}
