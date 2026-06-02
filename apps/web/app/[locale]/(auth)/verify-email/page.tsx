import { getTranslations } from "next-intl/server";

import { VerifyEmailPanel } from "@/features/auth/ui/verify-email-panel";

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const t = await getTranslations("auth.verifyEmail");
  const { token } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
      <VerifyEmailPanel token={token ?? ""} />
    </div>
  );
}
