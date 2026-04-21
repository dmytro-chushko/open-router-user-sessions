"use client";

import { useQuery } from "@tanstack/react-query";

import { publicApiClient } from "@/shared/api/api-client";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export function useHelloWorldQuery() {
  return useQuery({
    queryKey: ["hello-world"],
    queryFn: async () => {
      const result = await publicApiClient.hello();

      if (result.status !== 200) {
        throw new Error(getApiErrorMessage(result.status, result.body));
      }

      const data = result.body;

      if (data == null) {
        throw new Error("Invalid response from hello API");
      }

      return data;
    },
  });
}
