"use client";

import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";

import { useDeleteAvatarMutation } from "@/entities/user";
import { useModal } from "@/shared/modal/use-modal";

export function useAvatarDeletionModal() {
  const t = useTranslations("protected.profile");
  const { isOpen, close } = useModal("avatar-deletion");
  const deleteAvatarMutation = useDeleteAvatarMutation();
  const isPending = deleteAvatarMutation.isPending;

  const handleDelete = async () => {
    try {
      await deleteAvatarMutation.mutateAsync();
      toast.success(t("deleteSuccess"));
      close();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("uploadErrors.generic");
      toast.error(message);
    }
  };

  return {
    isOpen,
    close,
    isPending,
    handleDelete,
    t,
  };
}
