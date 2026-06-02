"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useForgotPasswordMutation } from "@/entities/auth";
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/model/forgot-password-form.schema";

export function useForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const tCommon = useTranslations("auth.common");
  const forgotMutation = useForgotPasswordMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await forgotMutation.mutateAsync(values);
      setIsSubmitted(true);
      toast.success(t("success"));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : tCommon("unknownError");
      toast.error(message);
    }
  });

  return {
    form,
    handleSubmit,
    isPending: forgotMutation.isPending,
    isSubmitted,
  };
}
