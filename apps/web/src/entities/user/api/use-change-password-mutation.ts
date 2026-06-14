"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { currentUserQueryKey } from "./current-user-query-key";

import { publicApiClient } from "@/shared/api/api-client";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type ChangePasswordPayload = {
  currentPassword?: string;
  newPassword: string;
};

export function useChangePasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: ChangePasswordPayload) => {
      const result = await publicApiClient.users.changePassword({ body });

      if (result.status !== 200) {
        throw new Error(getApiErrorMessage(result.status, result.body));
      }

      return result.body;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
}
