import { z } from "zod";

export const roleSchema = z.enum(["USER", "ADMIN"]);

export const providerSchema = z.enum(["GOOGLE", "GITHUB"]);

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

export const userMeSchema = userPublicSchema.extend({
  connectedProviders: z.array(providerSchema),
  hasPassword: z.boolean(),
});

export type UserMe = z.infer<typeof userMeSchema>;

export const avatarUploadIntentSchema = z.object({
  uploadUrl: z.string().url(),
  path: z.string().min(1),
  publicUrl: z.string().url(),
  expiresAt: z.coerce.date(),
});

export type AvatarUploadIntent = z.infer<typeof avatarUploadIntentSchema>;

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

export const avatarContentTypeSchema = z.enum([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
