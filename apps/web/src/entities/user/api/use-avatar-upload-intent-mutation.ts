"use client";

import type { AvatarUploadIntent } from "@repo/api-contracts";
import { useMutation } from "@tanstack/react-query";

import { publicApiClient } from "@/shared/api/api-client";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type AvatarUploadIntentPayload = {
  contentType: "image/jpeg" | "image/png" | "image/webp";
  contentLength: number;
};

export function useAvatarUploadIntentMutation() {
  return useMutation({
    mutationFn: async (
      body: AvatarUploadIntentPayload,
    ): Promise<AvatarUploadIntent> => {
      const result = await publicApiClient.users.avatarUploadIntent({ body });

      if (result.status !== 200) {
        throw new Error(getApiErrorMessage(result.status, result.body));
      }

      return result.body;
    },
  });
}

export async function uploadAvatarToSignedUrl(
  uploadUrl: string,
  file: File,
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Avatar upload failed with status ${response.status}`);
  }
}
