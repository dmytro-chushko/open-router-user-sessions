import { z } from "zod";

export const profileNameFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export type ProfileNameFormValues = z.infer<typeof profileNameFormSchema>;
