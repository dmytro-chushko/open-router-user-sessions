import { getTranslations } from "next-intl/server";

import { LoginForm } from "@/features/auth/ui/login-form";

export default async function LoginPage() {
  const t = await getTranslations("auth.login");

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
      <LoginForm />
    </div>
  );
}
