import { z } from "zod";

export const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
