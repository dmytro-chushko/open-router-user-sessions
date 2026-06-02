"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useRegisterMutation } from "@/entities/auth";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/features/auth/model/register-form.schema";
import { useRouter } from "@/i18n/navigation";

export function useRegisterForm() {
  const t = useTranslations("auth.register");
  const tCommon = useTranslations("auth.common");
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await registerMutation.mutateAsync(values);
      toast.success(t("success"));
      router.push(
        `/verify-email/pending?email=${encodeURIComponent(values.email)}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : tCommon("unknownError");
      toast.error(message);
    }
  });

  return {
    form,
    handleSubmit,
    isPending: registerMutation.isPending,
  };
}
