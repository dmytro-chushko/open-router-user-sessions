import { getTranslations } from "next-intl/server";

import { verifySession } from "@/shared/auth/verify-session";

export default async function ProfilePage() {
  const user = await verifySession();
  const t = await getTranslations("protected.profile");

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">{t("title")}</h1>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="font-medium">{t("email")}</dt>
          <dd>{user?.email || ""}</dd>
        </div>
        <div>
          <dt className="font-medium">{t("role")}</dt>
          <dd>{user?.role || ""}</dd>
        </div>
      </dl>
    </div>
  );
}
