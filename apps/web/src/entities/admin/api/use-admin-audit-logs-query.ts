"use client";

import type {
  AuditLogListResult,
  AuditLogsListQuery,
} from "@repo/api-contracts";
import { useQuery } from "@tanstack/react-query";

import { adminAuditLogsQueryKey } from "./admin-audit-logs-query-key";

import { publicApiClient } from "@/shared/api/api-client";
import { ApiRequestError } from "@/shared/api/api-request-error";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

type UseAdminAuditLogsQueryOptions = {
  params: AuditLogsListQuery;
  enabled?: boolean;
};

export function useAdminAuditLogsQuery({
  params,
  enabled = true,
}: UseAdminAuditLogsQueryOptions) {
  return useQuery<AuditLogListResult>({
    queryKey: adminAuditLogsQueryKey(params),
    enabled,
    queryFn: async () => {
      const result = await publicApiClient.admin.listAuditLogs({
        query: params,
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
