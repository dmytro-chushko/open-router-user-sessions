"use client";

import type { AdminUserDetail as AdminUserDetailData } from "@repo/api-contracts";
import { Badge, Button, Skeleton } from "@repo/ui";
import { notFound } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect } from "react";

import { useAdminUserQuery } from "@/entities/admin/api/use-admin-user-query";
import { AdminUserActions } from "@/features/admin/ui/user-detail/admin-user-actions";
import { AdminUserSessionsList } from "@/features/admin/ui/user-detail/admin-user-sessions-list";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { UserAvatar } from "@/shared/ui/user-avatar";

type AdminUserDetailViewProps = {
  userId: string;
};

function AdminUserDetailSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

function AdminUserAuthProviders({ user }: { user: AdminUserDetailData }) {
  const t = useTranslations("protected.admin.userDetail.auth");
  const tUsers = useTranslations("protected.admin.users");
  const badges: string[] = [];

  if (user.connectedProviders.includes("GOOGLE")) {
    badges.push(tUsers("auth.google"));
  }

  if (user.connectedProviders.includes("GITHUB")) {
    badges.push(tUsers("auth.github"));
  }

  if (badges.length === 0) {
    return <span className="text-sm text-muted-foreground">{t("none")}</span>;
  }

  return (
    <ul className="flex flex-wrap gap-1" role="list">
      {badges.map((label) => (
        <li key={label}>
          <Badge variant="secondary">{label}</Badge>
        </li>
      ))}
    </ul>
  );
}

function AdminUserDetailContent({ user }: { user: AdminUserDetailData }) {
  const t = useTranslations("protected.admin.userDetail");
  const tUsers = useTranslations("protected.admin.users");
  const format = useFormatter();
  const displayName = user.name?.trim() || t("profile.noName");
  const isVerified = user.emailVerifiedAt !== null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start gap-4">
        <UserAvatar
          name={user.name}
          email={user.email}
          avatarUrl={user.avatar}
          size="lg"
        />
        <div className="min-w-0 space-y-2">
          <h1 className="truncate text-2xl font-semibold">{displayName}</h1>
          <p className="truncate text-muted-foreground">{user.email}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {user.role === "ADMIN" ? tUsers("roleAdmin") : tUsers("roleUser")}
            </Badge>
            <Badge variant={isVerified ? "secondary" : "outline"}>
              {isVerified ? tUsers("verifiedYes") : tUsers("verifiedNo")}
            </Badge>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t("profile.title")}</h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="grid gap-1">
            <dt className="font-medium">{t("profile.name")}</dt>
            <dd className="text-muted-foreground">{displayName}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t("profile.email")}</dt>
            <dd className="text-muted-foreground">{user.email}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t("profile.role")}</dt>
            <dd className="text-muted-foreground">
              {user.role === "ADMIN" ? tUsers("roleAdmin") : tUsers("roleUser")}
            </dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t("profile.verified")}</dt>
            <dd className="text-muted-foreground">
              {isVerified ? tUsers("verifiedYes") : tUsers("verifiedNo")}
            </dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t("profile.memberSince")}</dt>
            <dd className="text-muted-foreground">
              {format.dateTime(user.createdAt, { dateStyle: "medium" })}
            </dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t("profile.updatedAt")}</dt>
            <dd className="text-muted-foreground">
              {format.dateTime(user.updatedAt, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t("auth.title")}</h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="grid gap-1">
            <dt className="font-medium">{t("auth.providers")}</dt>
            <dd>
              <AdminUserAuthProviders user={user} />
            </dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t("auth.password")}</dt>
            <dd className="text-muted-foreground">
              {user.hasPassword ? t("auth.hasPassword") : t("auth.noPassword")}
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t("sessions.title")}</h2>
        <AdminUserSessionsList sessions={user.sessions} />
      </section>

      <AdminUserActions user={user} />
    </div>
  );
}

export function AdminUserDetail({ userId }: AdminUserDetailViewProps) {
  const t = useTranslations("protected.admin.userDetail");
  const query = useAdminUserQuery({ userId });

  useEffect(() => {
    if (query.error instanceof ApiRequestError && query.error.status === 404) {
      notFound();
    }
  }, [query.error]);

  if (query.isPending) {
    return <AdminUserDetailSkeleton />;
  }

  if (query.isError) {
    if (query.error instanceof ApiRequestError && query.error.status === 404) {
      return null;
    }

    return (
      <div className="space-y-3" role="alert">
        <p className="text-sm text-destructive">{t("loadError")}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            void query.refetch();
          }}
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  return <AdminUserDetailContent user={query.data} />;
}
