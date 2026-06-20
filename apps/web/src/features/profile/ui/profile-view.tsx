"use client";

import type { UserMe } from "@repo/api-contracts";
import { Separator } from "@repo/ui";

import { useProfileView } from "@/features/profile/hooks/use-profile-view";
import { AvatarEditor } from "@/features/profile/ui/avatar-editor";
import { ConnectedAccountsList } from "@/features/profile/ui/connected-accounts-list";
import { ProfileDeleteAccountSection } from "@/features/profile/ui/profile-delete-account-section";
import { ProfileNameForm } from "@/features/profile/ui/profile-name-form";
import { ProfilePasswordSection } from "@/features/profile/ui/profile-password-section";
import { ProfileSettingsSection } from "@/features/profile/ui/profile-settings-section";

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
    <div className="mx-auto w-full max-w-3xl px-6 py-8 md:max-w-4xl lg:max-w-5xl">
      <header className="mb-2">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
      </header>

      <div className="divide-y divide-border">
        <ProfileSettingsSection
          title={t("avatarSectionTitle")}
          description={t("avatarSectionDescription")}
        >
          <AvatarEditor user={user} />
        </ProfileSettingsSection>

        <ProfileSettingsSection title={t("detailsSectionTitle")}>
          <div className="space-y-6">
            <div className="md:max-w-md">
              <ProfileNameForm user={user} />
            </div>
            <Separator />
            <dl className="grid gap-4 text-sm md:grid-cols-2">
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
              <div className="grid gap-1 md:col-span-2">
                <dt className="font-medium">{t("connectedAccounts.title")}</dt>
                <dd>
                  <ConnectedAccountsList
                    connectedProviders={user.connectedProviders}
                  />
                </dd>
              </div>
            </dl>
          </div>
        </ProfileSettingsSection>

        <ProfileSettingsSection
          ref={passwordCardRef}
          className="scroll-mb-6"
          title={t("passwordSectionTitle")}
          description={t("passwordSectionDescription")}
        >
          <div className="md:max-w-md">
            <ProfilePasswordSection
              hasPassword={user.hasPassword}
              onExpanded={scrollPasswordCardIntoView}
            />
          </div>
        </ProfileSettingsSection>
      </div>

      <ProfileSettingsSection
        variant="destructive"
        className="mt-8"
        title={t("dangerZone.title")}
        description={t("dangerZone.subtitle")}
      >
        <ProfileDeleteAccountSection
          email={user.email}
          hasPassword={user.hasPassword}
          isAdmin={user.role === "ADMIN"}
        />
      </ProfileSettingsSection>
    </div>
  );
}
