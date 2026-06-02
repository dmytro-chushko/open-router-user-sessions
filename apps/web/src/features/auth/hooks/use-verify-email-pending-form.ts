"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useResendVerificationMutation } from "@/entities/auth";
import { useResendCooldown } from "@/features/auth/hooks/use-resend-cooldown";
import {
  resendVerificationFormSchema,
  type ResendVerificationFormValues,
} from "@/features/auth/model/resend-verification-form.schema";

export function useVerifyEmailPendingForm(initialEmail: string) {
  const t = useTranslations("auth.verifyEmailPending");
  const tCommon = useTranslations("auth.common");
  const resendMutation = useResendVerificationMutation();
  const { isCooldownActive, secondsLeft, startCooldown } = useResendCooldown();
  const form = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationFormSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (isCooldownActive) {
      return;
    }

    try {
      await resendMutation.mutateAsync(values);
      toast.success(t("resendSuccess"));
      startCooldown();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : tCommon("unknownError");
      toast.error(message);
    }
  });

  return {
    form,
    handleSubmit,
    isPending: resendMutation.isPending,
    resendCooldownSeconds: secondsLeft,
  };
}
