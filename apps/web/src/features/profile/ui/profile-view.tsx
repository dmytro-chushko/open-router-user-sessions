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

import { useProfileView } from "@/features/profile/hooks/use-profile-view";
import { AvatarEditor } from "@/features/profile/ui/avatar-editor";
import { ConnectedAccountsList } from "@/features/profile/ui/connected-accounts-list";
import { ProfileDeleteAccountSection } from "@/features/profile/ui/profile-delete-account-section";
import { ProfileNameForm } from "@/features/profile/ui/profile-name-form";
import { ProfilePasswordSection } from "@/features/profile/ui/profile-password-section";

type ProfileViewProps = {
  initialUser: UserMe;
};

export function ProfileView({ initialUser }: ProfileViewProps) {
  const {
    user,
    t,
    roleLabel,
    emailVerifiedLabel,
    memberSince,
    passwordCardRef,
    scrollPasswordCardIntoView,
  } = useProfileView(initialUser);

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

      <ProfileCard ref={passwordCardRef} className="scroll-mb-6">
        <ProfileCardHeader>
          <ProfileCardTitle>{t("passwordSectionTitle")}</ProfileCardTitle>
          <ProfileCardDescription>
            {t("passwordSectionDescription")}
          </ProfileCardDescription>
        </ProfileCardHeader>
        <ProfileCardContent>
          <ProfilePasswordSection
            hasPassword={user.hasPassword}
            onExpanded={scrollPasswordCardIntoView}
          />
        </ProfileCardContent>
      </ProfileCard>

      <ProfileCard className="border-destructive/40">
        <ProfileCardHeader>
          <ProfileCardTitle className="text-destructive">
            {t("dangerZone.title")}
          </ProfileCardTitle>
          <ProfileCardDescription>
            {t("dangerZone.subtitle")}
          </ProfileCardDescription>
        </ProfileCardHeader>
        <ProfileCardContent>
          <ProfileDeleteAccountSection
            email={user.email}
            hasPassword={user.hasPassword}
            isAdmin={user.role === "ADMIN"}
          />
        </ProfileCardContent>
      </ProfileCard>
    </div>
  );
}
