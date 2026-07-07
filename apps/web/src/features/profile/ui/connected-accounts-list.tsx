"use client";

import type { UserMe } from "@repo/api-contracts";
import { Badge } from "@repo/ui";
import { useTranslations } from "next-intl";

type ConnectedAccountsListProps = {
  connectedProviders?: UserMe["connectedProviders"];
};

export function ConnectedAccountsList({
  connectedProviders = [],
}: ConnectedAccountsListProps) {
  const t = useTranslations("protected.profile.connectedAccounts");

  if (connectedProviders.length === 0) {
    return <p className="text-muted-foreground text-sm">{t("none")}</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2" role="list">
      {connectedProviders.includes("GOOGLE") ? (
        <li>
          <Badge variant="secondary">{t("google")}</Badge>
        </li>
      ) : null}
      {connectedProviders.includes("GITHUB") ? (
        <li>
          <Badge variant="secondary">{t("github")}</Badge>
        </li>
      ) : null}
    </ul>
  );
}
