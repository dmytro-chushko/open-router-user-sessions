import { useModal } from "@/shared/modal/use-modal";

export function useAdminUserDeletionModal() {
  const { isOpen, payload, close } = useModal("admin-user-deletion");

  return {
    isOpen,
    payload,
    close,
  };
}
