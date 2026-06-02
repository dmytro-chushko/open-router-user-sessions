import { getTranslations } from "next-intl/server";

import { RegisterForm } from "@/features/auth/ui/register-form";

export default async function RegisterPage() {
  const t = await getTranslations("auth.register");

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
      <RegisterForm />
    </div>
  );
}
