import { getTranslations } from "next-intl/server";

import { ResetPasswordForm } from "@/features/auth/ui/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const t = await getTranslations("auth.resetPassword");
  const { token } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
      <ResetPasswordForm token={token ?? ""} />
    </div>
  );
}
