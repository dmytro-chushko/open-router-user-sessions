"use client";

import type { AdminUserDetail } from "@repo/api-contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminUserQueryKey } from "./admin-user-query-key";
import { adminUsersQueryKeyRoot } from "./admin-users-query-key";

import { publicApiClient } from "@/shared/api/api-client";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type AdminUpdateRolePayload = {
  userId: string;
  role: AdminUserDetail["role"];
};

export function useAdminUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: AdminUpdateRolePayload) => {
      const result = await publicApiClient.admin.updateUserRole({
        params: { id: userId },
        body: { role },
      });

      if (result.status !== 200) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }

      return result.body;
    },
    onSuccess: async (data: AdminUserDetail, { userId }) => {
      queryClient.setQueryData(adminUserQueryKey(userId), data);
      await queryClient.invalidateQueries({
        queryKey: adminUsersQueryKeyRoot,
      });
    },
  });
}
