"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminUsersQueryKeyRoot } from "./admin-users-query-key";

import { publicApiClient } from "@/shared/api/api-client";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type AdminDeleteUserPayload = {
  userId: string;
};

export function useAdminDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: AdminDeleteUserPayload) => {
      const result = await publicApiClient.admin.deleteUser({
        params: { id: userId },
        body: {},
      });

      if (result.status !== 204) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminUsersQueryKeyRoot,
      });
    },
  });
}
