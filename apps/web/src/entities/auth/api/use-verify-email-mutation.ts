"use client";

import { useMutation } from "@tanstack/react-query";

import { publicApiClient } from "@/shared/api/api-client";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type VerifyEmailPayload = {
  token: string;
};

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: async (body: VerifyEmailPayload) => {
      const result = await publicApiClient.auth.verifyEmail({ body });

      if (result.status !== 200) {
        throw new Error(getApiErrorMessage(result.status, result.body));
      }

      return result.body;
    },
  });
}
