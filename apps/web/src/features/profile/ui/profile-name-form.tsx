"use client";

import type { UserMe } from "@repo/api-contracts";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@repo/ui";
import { useTranslations } from "next-intl";

import { useProfileNameForm } from "@/features/profile/hooks/use-profile-name-form";

type ProfileNameFormProps = {
  user: UserMe;
};

export function ProfileNameForm({ user }: ProfileNameFormProps) {
  const t = useTranslations("protected.profile");
  const { form, handleSubmit, isPending } = useProfileNameForm(user);

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? t("savingName") : t("saveName")}
        </Button>
      </form>
    </Form>
  );
}
