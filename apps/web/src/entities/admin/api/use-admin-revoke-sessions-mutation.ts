"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminUserQueryKey } from "./admin-user-query-key";

import { publicApiClient } from "@/shared/api/api-client";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type AdminRevokeSessionsPayload = {
  userId: string;
};

export function useAdminRevokeSessionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: AdminRevokeSessionsPayload) => {
      const result = await publicApiClient.admin.revokeUserSessions({
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
    onSuccess: async (_data, { userId }) => {
      await queryClient.invalidateQueries({
        queryKey: adminUserQueryKey(userId),
      });
    },
  });
}
