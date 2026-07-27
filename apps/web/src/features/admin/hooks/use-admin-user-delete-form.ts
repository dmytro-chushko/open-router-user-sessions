"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useAdminDeleteUserMutation } from "@/entities/admin/api/use-admin-delete-user-mutation";
import { mapAdminUsersApiError } from "@/features/admin/lib/map-admin-users-api-error";
import {
  createAdminUserDeleteFormSchema,
  type AdminUserDeleteFormValues,
} from "@/features/admin/model/admin-user-delete.schema";
import { useRouter } from "@/i18n/navigation";
import { ApiRequestError } from "@/shared/api/api-request-error";

type UseAdminUserDeleteFormOptions = {
  userId: string;
  email: string;
  onSuccess?: () => void;
};

export function useAdminUserDeleteForm({
  userId,
  email,
  onSuccess,
}: UseAdminUserDeleteFormOptions) {
  const t = useTranslations("protected.admin.actions");
  const tErrors = useTranslations("protected.admin.errors");
  const router = useRouter();
  const deleteUserMutation = useAdminDeleteUserMutation();
  const schema = useMemo(
    () =>
      createAdminUserDeleteFormSchema(email, {
        emailMismatch: t("deleteConfirmEmailMismatch"),
      }),
    [email, t],
  );
  const form = useForm<AdminUserDeleteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailConfirmation: "",
    },
  });

  const handleSubmit = form.handleSubmit(async () => {
    try {
      await deleteUserMutation.mutateAsync({ userId });
      form.reset();
      toast.success(t("deleteUserSuccess"));
      onSuccess?.();
      router.replace("/admin/users");
      router.refresh();
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
  });

  return {
    form,
    handleSubmit,
    isPending: deleteUserMutation.isPending,
  };
}
