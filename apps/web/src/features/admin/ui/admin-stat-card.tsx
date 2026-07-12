"use client";

import {
  ProfileCard,
  ProfileCardContent,
  ProfileCardHeader,
  ProfileCardTitle,
} from "@repo/ui";

import { Link } from "@/i18n/navigation";

type AdminStatCardProps = {
  label: string;
  value: number;
  actionLabel: string;
  href: string;
};

export function AdminStatCard({
  label,
  value,
  actionLabel,
  href,
}: AdminStatCardProps) {
  return (
    <ProfileCard className="flex h-full flex-col">
      <ProfileCardHeader className="pb-2">
        <ProfileCardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </ProfileCardTitle>
      </ProfileCardHeader>
      <ProfileCardContent className="mt-auto space-y-3">
        <p className="text-3xl font-semibold tabular-nums">
          {value.toLocaleString()}
        </p>
        <Link
          href={href}
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          {actionLabel}
        </Link>
      </ProfileCardContent>
    </ProfileCard>
  );
}
