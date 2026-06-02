"use client";

import { useMutation } from "@tanstack/react-query";

import { publicApiClient } from "@/shared/api/api-client";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type ForgotPasswordPayload = {
  email: string;
};

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (body: ForgotPasswordPayload) => {
      const result = await publicApiClient.auth.forgotPassword({ body });

      if (result.status !== 200) {
        throw new Error(getApiErrorMessage(result.status, result.body));
      }

      return result.body;
    },
  });
}
