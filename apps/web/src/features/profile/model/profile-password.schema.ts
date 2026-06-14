import { z } from "zod";

type ProfilePasswordFormMessages = {
  currentPasswordRequired: string;
  passwordsMismatch: string;
};

export function createProfilePasswordFormSchema(
  hasPassword: boolean,
  messages: ProfilePasswordFormMessages,
) {
  return z
    .object({
      currentPassword: z.string().max(128).optional(),
      newPassword: z.string().min(8).max(128),
      confirmPassword: z.string().min(8).max(128),
    })
    .superRefine((values, ctx) => {
      if (
        hasPassword &&
        (values.currentPassword === undefined ||
          values.currentPassword.trim().length === 0)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["currentPassword"],
          message: messages.currentPasswordRequired,
        });
      }
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: messages.passwordsMismatch,
      path: ["confirmPassword"],
    });
}

export type ProfilePasswordFormValues = z.infer<
  ReturnType<typeof createProfilePasswordFormSchema>
>;
