"use client";

import { Button } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { useVerifyEmail } from "@/features/auth/hooks/use-verify-email";
import { Link } from "@/i18n/navigation";

type VerifyEmailPanelProps = {
  token: string;
};

export function VerifyEmailPanel({ token }: VerifyEmailPanelProps) {
  const t = useTranslations("auth.verifyEmail");
  const hasAutoSubmittedRef = useRef(false);
  const { isPending, isError, isVerified, verifyToken, goToLogin } =
    useVerifyEmail(token);
  const hasToken = token.trim() !== "";

  useEffect(() => {
    if (!hasToken || hasAutoSubmittedRef.current) {
      return;
    }

    hasAutoSubmittedRef.current = true;
    void verifyToken();
  }, [hasToken, verifyToken]);

  if (!hasToken) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{t("missingToken")}</p>
        <Link className="underline underline-offset-4" href="/login">
          {t("backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {isPending
          ? t("autoVerifying")
          : isVerified
            ? t("verifiedHint")
            : t("autoVerifyDone")}
      </p>
      {isVerified ? (
        <Button className="w-full" type="button" onClick={goToLogin}>
          {t("goToLogin")}
        </Button>
      ) : null}
      {isError ? (
        <Button
          className="w-full"
          type="button"
          disabled={isPending}
          onClick={() => {
            void verifyToken();
          }}
        >
          {isPending ? t("submitting") : t("retry")}
        </Button>
      ) : null}
    </div>
  );
}
