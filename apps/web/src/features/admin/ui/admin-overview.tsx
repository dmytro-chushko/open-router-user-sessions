"use client";

import { Skeleton } from "@repo/ui";
import { useTranslations } from "next-intl";

import { useAdminStatsQuery } from "@/entities/admin/api/use-admin-stats-query";
import { buildAdminOverviewKpis } from "@/features/admin/config/admin-overview-kpis";
import { AdminStatCard } from "@/features/admin/ui/admin-stat-card";

const KPI_SKELETON_COUNT = 5;

function AdminOverviewSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {Array.from({ length: KPI_SKELETON_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}

export function AdminOverview() {
  const t = useTranslations("protected.admin.overview");
  const { data, isPending, isError, error } = useAdminStatsQuery();

  if (isPending) {
    return <AdminOverviewSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {error.message}
      </p>
    );
  }

  const kpis = buildAdminOverviewKpis(data);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {kpis.map((kpi) => (
        <AdminStatCard
          key={kpi.id}
          label={t(`stats.${kpi.id}.label`)}
          value={kpi.value}
          actionLabel={t(`stats.${kpi.id}.action`)}
          href={kpi.href}
        />
      ))}
    </div>
  );
}
