import { useModal } from "@/shared/modal/use-modal";

export function useProfileDeletionModal() {
  const { isOpen, payload, close } = useModal("profile-deletion");

  return {
    isOpen,
    payload,
    close,
  };
}
