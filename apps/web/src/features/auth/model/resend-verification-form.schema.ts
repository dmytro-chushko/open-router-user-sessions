import { z } from "zod";

export const resendVerificationFormSchema = z.object({
  email: z.string().email(),
});

export type ResendVerificationFormValues = z.infer<
  typeof resendVerificationFormSchema
>;
