"use client";

import { useMutation } from "@tanstack/react-query";

import { publicApiClient } from "@/shared/api/api-client";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async (body: ResetPasswordPayload) => {
      const result = await publicApiClient.auth.resetPassword({ body });

      if (result.status !== 200) {
        throw new Error(getApiErrorMessage(result.status, result.body));
      }

      return result.body;
    },
  });
}
