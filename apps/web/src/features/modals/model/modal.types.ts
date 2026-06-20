export type ModalName = "profile-deletion" | "avatar-deletion";

export type ModalPayloads = {
  "profile-deletion": {
    email: string;
    hasPassword: boolean;
  };
  "avatar-deletion": Record<string, never>;
};
