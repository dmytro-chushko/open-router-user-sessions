import { getTranslations } from "next-intl/server";

import { verifyAdminSession } from "@/shared/auth/verify-admin-session";

export default async function AdminPage() {
  const user = await verifyAdminSession();
  const t = await getTranslations("protected.admin");

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="mb-2 text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground">
        {t("welcome", { email: user.email })}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">{t("description")}</p>
    </div>
  );
}
