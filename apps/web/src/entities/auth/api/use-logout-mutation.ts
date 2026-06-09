"use client";

import { useMutation } from "@tanstack/react-query";

import { publicApiClient } from "@/shared/api/api-client";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      const result = await publicApiClient.auth.logout({ body: {} });

      if (result.status !== 204) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }
    },
  });
}
