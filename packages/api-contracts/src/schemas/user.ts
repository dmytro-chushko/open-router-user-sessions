import { z } from "zod";

export const roleSchema = z.enum(["USER", "ADMIN"]);

/** Public user (no passwordHash) — aligned with API PublicUser */
export const userPublicSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatar: z.string().nullable(),
  role: roleSchema,
  emailVerifiedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserPublic = z.infer<typeof userPublicSchema>;
