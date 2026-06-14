"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useChangePasswordMutation } from "@/entities/user";
import {
  createProfilePasswordFormSchema,
  type ProfilePasswordFormValues,
} from "@/features/profile/model/profile-password.schema";

type UseProfilePasswordFormOptions = {
  hasPassword: boolean;
  onSuccess?: () => void;
};

export function useProfilePasswordForm({
  hasPassword,
  onSuccess,
}: UseProfilePasswordFormOptions) {
  const t = useTranslations("protected.profile.password");
  const changePasswordMutation = useChangePasswordMutation();
  const schema = useMemo(
    () =>
      createProfilePasswordFormSchema(hasPassword, {
        currentPasswordRequired: t("errors.currentPasswordRequired"),
        passwordsMismatch: t("errors.mismatch"),
      }),
    [hasPassword, t],
  );
  const form = useForm<ProfilePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: hasPassword ? values.currentPassword : undefined,
        newPassword: values.newPassword,
      });
      form.reset();
      toast.success(t("updateSuccess"));
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : t("updateError");
      toast.error(message);
    }
  });

  return {
    form,
    handleSubmit,
    isPending: changePasswordMutation.isPending,
  };
}
