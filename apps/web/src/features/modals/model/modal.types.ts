export type ModalName =
  | "profile-deletion"
  | "avatar-deletion"
  | "admin-revoke-sessions"
  | "admin-user-deletion";

export type ModalPayloads = {
  "profile-deletion": {
    email: string;
    hasPassword: boolean;
  };
  "avatar-deletion": Record<string, never>;
  "admin-revoke-sessions": {
    userId: string;
    email: string;
  };
  "admin-user-deletion": {
    userId: string;
    email: string;
  };
};
