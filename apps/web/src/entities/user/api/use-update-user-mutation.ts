"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { currentUserQueryKey } from "./current-user-query-key";

import { publicApiClient } from "@/shared/api/api-client";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type UpdateUserPayload = {
  name?: string;
};

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateUserPayload) => {
      const result = await publicApiClient.users.updateMe({ body });

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
