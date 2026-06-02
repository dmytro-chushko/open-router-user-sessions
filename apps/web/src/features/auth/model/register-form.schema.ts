import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().max(120).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
