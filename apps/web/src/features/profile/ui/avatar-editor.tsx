"use client";

import type { UserMe } from "@repo/api-contracts";
import { Button } from "@repo/ui";
import { useTranslations } from "next-intl";

import { useAvatarUpload } from "@/features/profile/hooks/use-avatar-upload";
import { useModal } from "@/shared/modal/use-modal";
import { UserAvatar } from "@/shared/ui/user-avatar";

type AvatarEditorProps = {
  user: UserMe;
};

export function AvatarEditor({ user }: AvatarEditorProps) {
  const t = useTranslations("protected.profile");
  const { open } = useModal("avatar-deletion");
  const { fileInputRef, openFilePicker, handleFileChange, isUploading } =
    useAvatarUpload();

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <UserAvatar
        name={user.name}
        email={user.email}
        avatarUrl={user.avatar}
        size="lg"
      />
      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            void handleFileChange(event);
          }}
        />
        <Button
          type="button"
          variant="outline"
          aria-busy={isUploading}
          disabled={isUploading}
          onClick={openFilePicker}
        >
          {isUploading ? t("uploading") : t("changeAvatar")}
        </Button>
        {user.avatar ? (
          <Button
            type="button"
            variant="destructive"
            disabled={isUploading}
            onClick={() => open("avatar-deletion", {})}
          >
            {t("deleteAvatar")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
