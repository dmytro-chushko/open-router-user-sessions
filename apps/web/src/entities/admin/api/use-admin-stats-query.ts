"use client";

import type { AdminStatsOverview } from "@repo/api-contracts";
import { useQuery } from "@tanstack/react-query";

import { adminStatsQueryKey } from "./admin-stats-query-key";

import { publicApiClient } from "@/shared/api/api-client";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export function useAdminStatsQuery() {
  return useQuery<AdminStatsOverview>({
    queryKey: adminStatsQueryKey,
    queryFn: async () => {
      const result = await publicApiClient.admin.getStats();

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
