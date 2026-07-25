"use client";

import type { AdminUserDetail } from "@repo/api-contracts";
import { useQuery } from "@tanstack/react-query";

import { adminUserQueryKey } from "./admin-user-query-key";

import { publicApiClient } from "@/shared/api/api-client";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

type UseAdminUserQueryOptions = {
  userId: string;
  enabled?: boolean;
};

export function useAdminUserQuery({
  userId,
  enabled = true,
}: UseAdminUserQueryOptions) {
  return useQuery<AdminUserDetail>({
    queryKey: adminUserQueryKey(userId),
    enabled: enabled && userId.length > 0,
    queryFn: async () => {
      const result = await publicApiClient.admin.getUser({
        params: { id: userId },
      });

      if (result.status !== 200) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }

      return result.body;
    },
  });
}
