"use client";

import { useMutation } from "@tanstack/react-query";

import { publicApiClient } from "@/shared/api/api-client";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type LoginPayload = {
  email: string;
  password: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (body: LoginPayload) => {
      const result = await publicApiClient.auth.login({ body });

      if (result.status !== 200) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }

      return result.body.user;
    },
  });
}
