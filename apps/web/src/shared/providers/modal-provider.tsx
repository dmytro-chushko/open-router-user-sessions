"use client";

import { ModalContextProvider } from "../modal/modal-context";

import { AdminRevokeSessionsModal } from "@/features/modals/ui/admin-revoke-sessions-modal";
import { AdminUserDeletionModal } from "@/features/modals/ui/admin-user-deletion-modal";
import { AvatarDeletionModal } from "@/features/modals/ui/avatar-deletion-modal";
import { ProfileDeletionModal } from "@/features/modals/ui/profile-deletion-modal";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModalContextProvider>
      {children}
      <ProfileDeletionModal />
      <AvatarDeletionModal />
      <AdminRevokeSessionsModal />
      <AdminUserDeletionModal />
    </ModalContextProvider>
  );
}
