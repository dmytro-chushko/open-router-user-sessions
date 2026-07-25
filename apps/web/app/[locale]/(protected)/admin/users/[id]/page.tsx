import { getTranslations } from "next-intl/server";

import { AdminUserDetail } from "@/features/admin/ui/user-detail/admin-user-detail";
import { Link } from "@/i18n/navigation";

type AdminUserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  const { id } = await params;
  const t = await getTranslations("protected.admin.userDetail");

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        ← {t("backToUsers")}
      </Link>
      <AdminUserDetail userId={id} />
    </div>
  );
}
