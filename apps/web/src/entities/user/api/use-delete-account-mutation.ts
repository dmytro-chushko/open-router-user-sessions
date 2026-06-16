"use client";

import { useMutation } from "@tanstack/react-query";

import { publicApiClient } from "@/shared/api/api-client";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type DeleteAccountPayload = {
  emailConfirmation: string;
  currentPassword?: string;
};

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: async (payload: DeleteAccountPayload) => {
      const result = await publicApiClient.users.deleteAccount({
        body: payload,
      });

      if (result.status !== 204) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }
    },
  });
}
