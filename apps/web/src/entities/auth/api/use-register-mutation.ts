"use client";

import { useMutation } from "@tanstack/react-query";

import { publicApiClient } from "@/shared/api/api-client";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";

export type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (body: RegisterPayload) => {
      const normalized = {
        email: body.email,
        password: body.password,
        name: body.name && body.name.trim() !== "" ? body.name : undefined,
      };
      const result = await publicApiClient.auth.register({ body: normalized });

      if (result.status !== 201) {
        throw new Error(getApiErrorMessage(result.status, result.body));
      }

      return result.body;
    },
  });
}
