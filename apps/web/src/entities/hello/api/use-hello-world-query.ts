"use client";

import { toast } from "@repo/ui";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { publicApiClient } from "@/shared/api/api-client";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export function useHelloWorldQuery() {
  const tErrors = useTranslations("errors.entities.hello");
  const query = useQuery({
    queryKey: ["hello-world"],
    queryFn: async () => {
      const result = await publicApiClient.hello();

      if (result.status !== 200) {
        throw new Error(getApiErrorMessage(result.status, result.body));
      }

      const data = result.body;

      if (data === null || data === undefined) {
        throw new Error(tErrors("invalidResponse"));
      }

      return data;
    },
  });

  useEffect(() => {
    if (query.isError && query.error !== null) {
      toast.error(query.error.message);
    }
  }, [query.error, query.isError]);

  return query;
}
