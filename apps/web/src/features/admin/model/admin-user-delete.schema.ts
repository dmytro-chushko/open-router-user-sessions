import { z } from "zod";

type AdminUserDeleteFormMessages = {
  emailMismatch: string;
};

export function createAdminUserDeleteFormSchema(
  expectedEmail: string,
  messages: AdminUserDeleteFormMessages,
) {
  return z
    .object({
      emailConfirmation: z.string().trim().min(1),
    })
    .superRefine((values, ctx) => {
      if (values.emailConfirmation !== expectedEmail) {
        ctx.addIssue({
          code: "custom",
          path: ["emailConfirmation"],
          message: messages.emailMismatch,
        });
      }
    });
}

export type AdminUserDeleteFormValues = z.infer<
  ReturnType<typeof createAdminUserDeleteFormSchema>
>;
