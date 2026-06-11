"use client";

import type { UserMe } from "@repo/api-contracts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  toast,
} from "@repo/ui";
import { useTranslations } from "next-intl";

import { useDeleteAvatarMutation } from "@/entities/user";
import { useAvatarUpload } from "@/features/profile/hooks/use-avatar-upload";
import { UserAvatar } from "@/shared/ui/user-avatar";

type AvatarEditorProps = {
  user: UserMe;
};

export function AvatarEditor({ user }: AvatarEditorProps) {
  const t = useTranslations("protected.profile");
  const { fileInputRef, openFilePicker, handleFileChange, isUploading } =
    useAvatarUpload();
  const deleteAvatarMutation = useDeleteAvatarMutation();

  const handleDelete = async () => {
    try {
      await deleteAvatarMutation.mutateAsync();
      toast.success(t("deleteSuccess"));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("uploadErrors.generic");
      toast.error(message);
    }
  };

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
          disabled={isUploading || deleteAvatarMutation.isPending}
          onClick={openFilePicker}
        >
          {isUploading ? t("uploading") : t("changeAvatar")}
        </Button>
        {user.avatar ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                disabled={isUploading || deleteAvatarMutation.isPending}
              >
                {deleteAvatarMutation.isPending
                  ? t("deleting")
                  : t("deleteAvatar")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deleteAvatar")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteAvatarConfirm")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    void handleDelete();
                  }}
                >
                  {t("deleteAvatar")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
    </div>
  );
}
