"use client";

import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useVerifyEmailMutation } from "@/entities/auth";
import { useRouter } from "@/i18n/navigation";

export function useVerifyEmail(tokenFromSearch: string) {
  const t = useTranslations("auth.verifyEmail");
  const tCommon = useTranslations("auth.common");
  const router = useRouter();
  const verifyMutation = useVerifyEmailMutation();
  const [isVerified, setIsVerified] = useState(false);

  const verifyToken = async () => {
    if (tokenFromSearch.trim() === "") {
      return;
    }

    try {
      await verifyMutation.mutateAsync({ token: tokenFromSearch });
      setIsVerified(true);
      toast.success(t("success"));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : tCommon("unknownError");
      toast.error(message);
    }
  };

  return {
    isPending: verifyMutation.isPending,
    isError: verifyMutation.isError,
    isVerified,
    verifyToken,
    goToLogin: () => router.push("/login"),
  };
}
