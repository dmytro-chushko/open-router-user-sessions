"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { UserMe } from "@repo/api-contracts";
import { toast } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useUpdateUserMutation } from "@/entities/user";
import {
  profileNameFormSchema,
  type ProfileNameFormValues,
} from "@/features/profile/model/profile-name.schema";

export function useProfileNameForm(user: UserMe) {
  const t = useTranslations("protected.profile");
  const updateUserMutation = useUpdateUserMutation();
  const form = useForm<ProfileNameFormValues>({
    resolver: zodResolver(profileNameFormSchema),
    defaultValues: {
      name: user.name ?? "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await updateUserMutation.mutateAsync({ name: values.name });
      toast.success(t("nameUpdateSuccess"));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("nameUpdateError");
      toast.error(message);
    }
  });

  return {
    form,
    handleSubmit,
    isPending: updateUserMutation.isPending,
  };
}
