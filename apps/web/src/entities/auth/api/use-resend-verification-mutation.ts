"use client";

import { useMutation } from "@tanstack/react-query";

import { publicApiClient } from "@/shared/api/api-client";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type ResendVerificationPayload = {
  email: string;
};

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: async (body: ResendVerificationPayload) => {
      const result = await publicApiClient.auth.resendVerification({ body });

      if (result.status !== 200) {
        throw new Error(getApiErrorMessage(result.status, result.body));
      }

      return result.body;
    },
  });
}
