"use client";

import type { UserMe } from "@repo/api-contracts";
import { useQuery } from "@tanstack/react-query";

import { currentUserQueryKey } from "./current-user-query-key";

import { publicApiClient } from "@/shared/api/api-client";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

const CURRENT_USER_RETRY_COUNT = 5;

type UseCurrentUserQueryOptions = {
  initialData?: UserMe;
};

export function useCurrentUserQuery(options: UseCurrentUserQueryOptions = {}) {
  return useQuery<UserMe | null>({
    queryKey: currentUserQueryKey,
    initialData: options.initialData,
    queryFn: async () => {
      const result = await publicApiClient.users.me();

      if (result.status === 401) {
        return null;
      }

      if (result.status !== 200) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }

      return result.body;
    },
    retry: (failureCount, error) => {
      if (failureCount >= CURRENT_USER_RETRY_COUNT) {
        return false;
      }

      if (error instanceof ApiRequestError && error.status === 401) {
        return false;
      }

      return true;
    },
  });
}
