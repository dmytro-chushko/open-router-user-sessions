"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useResetPasswordMutation } from "@/entities/auth";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/model/reset-password-form.schema";
import { useRouter } from "@/i18n/navigation";

export function useResetPasswordForm(tokenFromSearch: string) {
  const t = useTranslations("auth.resetPassword");
  const tCommon = useTranslations("auth.common");
  const router = useRouter();
  const resetMutation = useResetPasswordMutation();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token: tokenFromSearch,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await resetMutation.mutateAsync({
        token: values.token,
        newPassword: values.newPassword,
      });
      toast.success(t("success"));
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : tCommon("unknownError");
      toast.error(message);
    }
  });

  return {
    form,
    handleSubmit,
    isPending: resetMutation.isPending,
  };
}
