"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@repo/ui";

import { useAvatarDeletionModal } from "@/features/modals/hooks/use-avatar-deletion-modal";

export function AvatarDeletionModal() {
  const { isOpen, close, isPending, handleDelete, t } =
    useAvatarDeletionModal();

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      {isOpen ? (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteAvatar")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteAvatarConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {t("cancel")}
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              aria-busy={isPending}
              onClick={() => {
                void handleDelete();
              }}
            >
              {isPending ? t("deleting") : t("deleteAvatar")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : null}
    </AlertDialog>
  );
}
