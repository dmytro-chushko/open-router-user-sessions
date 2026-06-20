"use client";

import { ModalContextProvider } from "../modal/modal-context";

import { AvatarDeletionModal } from "@/features/modals/ui/avatar-deletion-modal";
import { ProfileDeletionModal } from "@/features/modals/ui/profile-deletion-modal";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModalContextProvider>
      {children}
      <ProfileDeletionModal />
      <AvatarDeletionModal />
    </ModalContextProvider>
  );
}
