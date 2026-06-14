"use client";

import type { UserMe } from "@repo/api-contracts";
import {
  ProfileCard,
  ProfileCardContent,
  ProfileCardDescription,
  ProfileCardHeader,
  ProfileCardTitle,
  Separator,
} from "@repo/ui";
import { useFormatter, useTranslations } from "next-intl";

import { useCurrentUserQuery } from "@/entities/user";
import { AvatarEditor } from "@/features/profile/ui/avatar-editor";
import { ConnectedAccountsList } from "@/features/profile/ui/connected-accounts-list";
import { ProfileNameForm } from "@/features/profile/ui/profile-name-form";
import { ProfilePasswordSection } from "@/features/profile/ui/profile-password-section";

type ProfileViewProps = {
  initialUser: UserMe;
};

export function ProfileView({ initialUser }: ProfileViewProps) {
  const { data } = useCurrentUserQuery({ initialData: initialUser });
  const user: UserMe = data ?? initialUser;
  const t = useTranslations("protected.profile");
  const format = useFormatter();

  const roleLabel = user.role === "ADMIN" ? t("roleAdmin") : t("roleUser");
  const emailVerifiedLabel =
    user.emailVerifiedAt !== null ? t("emailVerified") : t("emailNotVerified");
  const memberSince = format.dateTime(new Date(user.createdAt), {
    dateStyle: "medium",
  });

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
      </header>

      <ProfileCard>
        <ProfileCardHeader>
          <ProfileCardTitle>{t("avatarSectionTitle")}</ProfileCardTitle>
          <ProfileCardDescription>
            {t("avatarSectionDescription")}
          </ProfileCardDescription>
        </ProfileCardHeader>
        <ProfileCardContent>
          <AvatarEditor user={user} />
        </ProfileCardContent>
      </ProfileCard>

      <ProfileCard>
        <ProfileCardHeader>
          <ProfileCardTitle>{t("detailsSectionTitle")}</ProfileCardTitle>
        </ProfileCardHeader>
        <ProfileCardContent className="space-y-6">
          <ProfileNameForm user={user} />
          <Separator />
          <dl className="grid gap-4 text-sm">
            <div className="grid gap-1">
              <dt className="font-medium">{t("email")}</dt>
              <dd className="text-muted-foreground">{user.email}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="font-medium">{t("role")}</dt>
              <dd className="text-muted-foreground">{roleLabel}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="font-medium">{t("emailStatus")}</dt>
              <dd className="text-muted-foreground">{emailVerifiedLabel}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="font-medium">{t("memberSince")}</dt>
              <dd className="text-muted-foreground">{memberSince}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="font-medium">{t("connectedAccounts.title")}</dt>
              <dd>
                <ConnectedAccountsList
                  connectedProviders={user.connectedProviders}
                />
              </dd>
            </div>
          </dl>
        </ProfileCardContent>
      </ProfileCard>

      <ProfileCard>
        <ProfileCardHeader>
          <ProfileCardTitle>{t("passwordSectionTitle")}</ProfileCardTitle>
          <ProfileCardDescription>
            {t("passwordSectionDescription")}
          </ProfileCardDescription>
        </ProfileCardHeader>
        <ProfileCardContent>
          <ProfilePasswordSection hasPassword={user.hasPassword} />
        </ProfileCardContent>
      </ProfileCard>
    </div>
  );
}
