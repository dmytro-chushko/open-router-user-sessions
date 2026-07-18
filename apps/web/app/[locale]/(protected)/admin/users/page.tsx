import { Skeleton } from "@repo/ui";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { UsersTable } from "@/features/admin/ui/users-table/users-table";

function UsersTableFallback() {
  return (
    <div className="space-y-2" aria-hidden="true">
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  );
}

export default async function AdminUsersPage() {
  const t = await getTranslations("protected.admin.users");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <Suspense fallback={<UsersTableFallback />}>
        <UsersTable />
      </Suspense>
    </div>
  );
}
