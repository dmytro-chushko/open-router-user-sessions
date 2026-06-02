import { getTranslations } from "next-intl/server";

import { ForgotPasswordForm } from "@/features/auth/ui/forgot-password-form";

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth.forgotPassword");

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
      <ForgotPasswordForm />
    </div>
  );
}
