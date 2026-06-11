import { AVATAR_MAX_BYTES, avatarContentTypeSchema } from "@repo/api-contracts";
import { z } from "zod";

export const avatarUploadFileSchema = z
  .instanceof(File)
  .refine((file) => avatarContentTypeSchema.safeParse(file.type).success, {
    message: "invalidType",
  })
  .refine((file) => file.size <= AVATAR_MAX_BYTES, {
    message: "tooLarge",
  });

export type AvatarUploadFile = z.infer<typeof avatarUploadFileSchema>;
