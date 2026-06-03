import { getTranslations } from "next-intl/server";

import { verifySession } from "@/shared/auth/verify-session";

export default async function DashboardPage() {
  const user = await verifySession();
  const t = await getTranslations("protected.dashboard");

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="mb-2 text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground">
        {t("welcome", { email: user?.email || "" })}
      </p>
    </div>
  );
}
