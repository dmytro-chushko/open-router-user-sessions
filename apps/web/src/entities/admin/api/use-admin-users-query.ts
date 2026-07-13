"use client";

import {
  toAdminUsersListQueryParams,
  type AdminUserListResult,
  type AdminUsersListQuery,
} from "@repo/api-contracts";
import { useQuery } from "@tanstack/react-query";

import { adminUsersQueryKey } from "./admin-users-query-key";

import { publicApiClient } from "@/shared/api/api-client";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

type UseAdminUsersQueryOptions = {
  params: AdminUsersListQuery;
  enabled?: boolean;
};

export function useAdminUsersQuery({
  params,
  enabled = true,
}: UseAdminUsersQueryOptions) {
  return useQuery<AdminUserListResult>({
    queryKey: adminUsersQueryKey(params),
    enabled,
    queryFn: async () => {
      const result = await publicApiClient.admin.listUsers({
        query: toAdminUsersListQueryParams(params),
      });

      if (result.status !== 200) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }

      return result.body;
    },
    placeholderData: (previousData) => previousData,
  });
}
