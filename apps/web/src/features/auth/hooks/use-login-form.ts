"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  useLoginMutation,
  useResendVerificationMutation,
} from "@/entities/auth";
import { useResendCooldown } from "@/features/auth/hooks/use-resend-cooldown";
import {
  loginFormSchema,
  type LoginFormValues,
} from "@/features/auth/model/login-form.schema";
import { useRouter } from "@/i18n/navigation";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getPublicApiBaseUrl } from "@/shared/config/public-api-url";

export function useLoginForm() {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("auth.common");
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const resendVerificationMutation = useResendVerificationMutation();
  const { isCooldownActive, secondsLeft, startCooldown } = useResendCooldown();
  const [showEmailNotVerifiedHint, setShowEmailNotVerifiedHint] =
    useState(false);
  const [emailForResend, setEmailForResend] = useState<string>("");
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setShowEmailNotVerifiedHint(false);
      await loginMutation.mutateAsync(values);
      toast.success(t("success"));
      router.push("/");
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 403) {
        setShowEmailNotVerifiedHint(true);
        setEmailForResend(values.email);
      }
      const message =
        error instanceof Error ? error.message : tCommon("unknownError");
      toast.error(message);
    }
  });

  const handleResendVerification = async () => {
    if (isCooldownActive) {
      return;
    }

    try {
      const currentEmail = emailForResend || form.getValues("email");
      await resendVerificationMutation.mutateAsync({ email: currentEmail });
      toast.success(t("resendSuccess"));
      startCooldown();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : tCommon("unknownError");
      toast.error(message);
    }
  };

  const apiBaseUrl = getPublicApiBaseUrl();

  return {
    form,
    handleSubmit,
    isPending: loginMutation.isPending,
    isResending: resendVerificationMutation.isPending,
    resendCooldownSeconds: secondsLeft,
    showEmailNotVerifiedHint,
    handleResendVerification,
    googleAuthHref: `${apiBaseUrl}/auth/google`,
    githubAuthHref: `${apiBaseUrl}/auth/github`,
  };
}
