"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { USER_DELETION_ERROR_MESSAGES } from "@repo/api-contracts";
import { toast } from "@repo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { currentUserQueryKey } from "@/entities/auth";
import { useDeleteAccountMutation } from "@/entities/user";
import {
  createProfileDeleteAccountFormSchema,
  type ProfileDeleteAccountFormValues,
} from "@/features/profile/model/profile-delete-account.schema";
import { useRouter } from "@/i18n/navigation";
import { ApiRequestError } from "@/shared/api/api-request-error";

type UseProfileDeleteAccountFormOptions = {
  email: string;
  hasPassword: boolean;
  onSuccess?: () => void;
};

export function useProfileDeleteAccountForm({
  email,
  hasPassword,
  onSuccess,
}: UseProfileDeleteAccountFormOptions) {
  const t = useTranslations("protected.profile.dangerZone");
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteAccountMutation = useDeleteAccountMutation();
  const schema = useMemo(
    () =>
      createProfileDeleteAccountFormSchema(email, hasPassword, {
        emailMismatch: t("errors.emailMismatch"),
        currentPasswordRequired: t("errors.currentPasswordRequired"),
      }),
    [email, hasPassword, t],
  );
  const form = useForm<ProfileDeleteAccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailConfirmation: "",
      currentPassword: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await deleteAccountMutation.mutateAsync({
        emailConfirmation: values.emailConfirmation,
        currentPassword: hasPassword ? values.currentPassword : undefined,
      });
      queryClient.setQueryData(currentUserQueryKey, null);
      form.reset();
      toast.success(t("deleteSuccess"));
      onSuccess?.();
      router.push("/");
      router.refresh();
    } catch (error) {
      const apiMessage =
        error instanceof ApiRequestError ? error.message : undefined;
      const message =
        apiMessage !== undefined
          ? mapDeleteAccountApiError(apiMessage, t)
          : error instanceof Error
            ? error.message
            : t("deleteError");
      toast.error(message);
    }
  });

  return {
    form,
    handleSubmit,
    isPending: deleteAccountMutation.isPending,
  };
}

function mapDeleteAccountApiError(
  apiMessage: string,
  t: ReturnType<typeof useTranslations<"protected.profile.dangerZone">>,
): string {
  const messageMap: Record<string, string> = {
    [USER_DELETION_ERROR_MESSAGES.EMAIL_MISMATCH]: t("errors.emailMismatch"),
    [USER_DELETION_ERROR_MESSAGES.CURRENT_PASSWORD_REQUIRED]: t(
      "errors.currentPasswordRequired",
    ),
    [USER_DELETION_ERROR_MESSAGES.INVALID_PASSWORD]: t(
      "errors.invalidPassword",
    ),
    [USER_DELETION_ERROR_MESSAGES.ADMIN_CANNOT_DELETE]: t("adminCannotDelete"),
  };

  return messageMap[apiMessage] ?? apiMessage;
}
