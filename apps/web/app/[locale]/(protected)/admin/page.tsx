import { getTranslations } from "next-intl/server";

import { AdminOverview } from "@/features/admin/ui/admin-overview";

export default async function AdminPage() {
  const t = await getTranslations("protected.admin.overview");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <AdminOverview />
    </div>
  );
}
