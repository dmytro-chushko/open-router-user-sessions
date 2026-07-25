"use client";

import type { AdminUserSessionSummary } from "@repo/api-contracts";
import {
  Badge,
  ProfileCard,
  ProfileCardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { useFormatter, useTranslations } from "next-intl";

type AdminUserSessionsListProps = {
  sessions: AdminUserSessionSummary[];
};

function isSessionActive(expiresAt: Date): boolean {
  return expiresAt.getTime() > Date.now();
}

function SessionStatusBadge({
  isActive,
  activeLabel,
  expiredLabel,
}: {
  isActive: boolean;
  activeLabel: string;
  expiredLabel: string;
}) {
  return (
    <Badge variant={isActive ? "secondary" : "outline"}>
      {isActive ? activeLabel : expiredLabel}
    </Badge>
  );
}

export function AdminUserSessionsList({
  sessions,
}: AdminUserSessionsListProps) {
  const t = useTranslations("protected.admin.userDetail.sessions");
  const format = useFormatter();

  if (sessions.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  const formatDateTime = (value: Date) =>
    format.dateTime(value, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <>
      <ul className="space-y-3 md:hidden" role="list">
        {sessions.map((session) => {
          const isActive = isSessionActive(session.expiresAt);

          return (
            <li key={session.id}>
              <ProfileCard>
                <ProfileCardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-sm font-medium wrap-break-word">
                      {session.userAgent?.trim() || t("unknownAgent")}
                    </p>
                    <SessionStatusBadge
                      isActive={isActive}
                      activeLabel={t("active")}
                      expiredLabel={t("expired")}
                    />
                  </div>
                  <dl className="space-y-2 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <dt className="shrink-0 text-muted-foreground">
                        {t("ip")}
                      </dt>
                      <dd className="tabular-nums text-right">
                        {session.ipAddress ?? "—"}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="shrink-0 text-muted-foreground">
                        {t("createdAt")}
                      </dt>
                      <dd className="tabular-nums text-right text-muted-foreground">
                        {formatDateTime(session.createdAt)}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="shrink-0 text-muted-foreground">
                        {t("expiresAt")}
                      </dt>
                      <dd className="tabular-nums text-right text-muted-foreground">
                        {formatDateTime(session.expiresAt)}
                      </dd>
                    </div>
                  </dl>
                </ProfileCardContent>
              </ProfileCard>
            </li>
          );
        })}
      </ul>

      <div className="hidden md:block">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead>{t("userAgent")}</TableHead>
              <TableHead>{t("ip")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead>{t("expiresAt")}</TableHead>
              <TableHead>{t("status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => {
              const isActive = isSessionActive(session.expiresAt);

              return (
                <TableRow key={session.id}>
                  <TableCell className="max-w-[16rem] whitespace-normal">
                    {session.userAgent?.trim() || t("unknownAgent")}
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {session.ipAddress ?? "—"}
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {formatDateTime(session.createdAt)}
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {formatDateTime(session.expiresAt)}
                  </TableCell>
                  <TableCell>
                    <SessionStatusBadge
                      isActive={isActive}
                      activeLabel={t("active")}
                      expiredLabel={t("expired")}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
