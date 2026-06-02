import { getTranslations } from "next-intl/server";

import { VerifyEmailPendingPanel } from "@/features/auth/ui/verify-email-pending-panel";

type VerifyEmailPendingPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPendingPage({
  searchParams,
}: VerifyEmailPendingPageProps) {
  const t = await getTranslations("auth.verifyEmailPending");
  const { email } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
      <VerifyEmailPendingPanel email={email ?? ""} />
    </div>
  );
}
