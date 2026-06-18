"use client";

import { ModalContextProvider } from "../modal/modal-context";

import { ProfileDeletionModal } from "@/features/modals/ui/profile-deletion-modal";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModalContextProvider>
      {children}
      <ProfileDeletionModal />
    </ModalContextProvider>
  );
}
