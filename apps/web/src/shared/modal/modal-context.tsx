import { createContext, ReactNode, useContext, useState } from "react";

import {
  ModalName,
  ModalPayloads,
} from "@/features/modals/model/modal.types.ts";

type ModalState = {
  [K in ModalName]?: { isOpen: boolean; payload?: ModalPayloads[K] };
};

interface ModalContextValue {
  modals: ModalState;
  openModal: <K extends ModalName>(name: K, payload?: ModalPayloads[K]) => void;
  closeModal: (name: ModalName) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = () => {
  const ctx = useContext(ModalContext);

  if (!ctx) throw new Error("useModal must be used within ModalProvider");

  return ctx;
};

export function ModalContextProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalState>({});

  const openModal = <K extends ModalName>(
    name: K,
    payload?: ModalPayloads[K],
  ) => {
    setModals((prev) => ({ ...prev, [name]: { isOpen: true, payload } }));
  };

  const closeModal = (name: ModalName) => {
    setModals((prev) => ({
      ...prev,
      [name]: { ...prev[name], isOpen: false },
    }));
  };

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
