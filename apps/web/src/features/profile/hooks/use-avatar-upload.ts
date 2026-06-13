"use client";

import type { UserMe } from "@repo/api-contracts";
import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import {
  uploadAvatarToSignedUrl,
  useAvatarConfirmMutation,
  useAvatarUploadIntentMutation,
} from "@/entities/user";
import { avatarUploadFileSchema } from "@/features/profile/model/avatar-upload.schema";

export function useAvatarUpload() {
  const t = useTranslations("protected.profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadIntentMutation = useAvatarUploadIntentMutation();
  const confirmMutation = useAvatarConfirmMutation();
  const [isUploading, setIsUploading] = useState(false);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file === undefined) {
      return;
    }

    const parsed = avatarUploadFileSchema.safeParse(file);

    if (!parsed.success) {
      const issue = parsed.error.issues[0]?.message;

      if (issue === "tooLarge") {
        toast.error(t("uploadErrors.tooLarge"));

        return;
      }

      toast.error(t("uploadErrors.invalidType"));

      return;
    }

    try {
      setIsUploading(true);
      const intent = await uploadIntentMutation.mutateAsync({
        contentType: parsed.data.type as
          | "image/jpeg"
          | "image/png"
          | "image/webp",
        contentLength: parsed.data.size,
      });

      await uploadAvatarToSignedUrl(intent.uploadUrl, parsed.data);
      await confirmMutation.mutateAsync(intent.path);
      toast.success(t("uploadSuccess"));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("uploadErrors.generic");
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    fileInputRef,
    openFilePicker,
    handleFileChange,
    isUploading,
  };
}

export type ProfileUser = UserMe;
