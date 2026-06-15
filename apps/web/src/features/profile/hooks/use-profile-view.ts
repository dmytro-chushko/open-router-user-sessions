"use client";

import type { UserMe } from "@repo/api-contracts";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

import { useCurrentUserQuery } from "@/entities/user";

export function useProfileView(initialUser: UserMe) {
  const { data } = useCurrentUserQuery({ initialData: initialUser });
  const user: UserMe = data ?? initialUser;
  const t = useTranslations("protected.profile");
  const format = useFormatter();
  const roleLabel = user.role === "ADMIN" ? t("roleAdmin") : t("roleUser");
  const emailVerifiedLabel =
    user.emailVerifiedAt !== null ? t("emailVerified") : t("emailNotVerified");
  const memberSince = format.dateTime(new Date(user.createdAt), {
    dateStyle: "medium",
  });
  const passwordCardRef = useRef<HTMLDivElement>(null);
  const scrollPasswordCardIntoView = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        passwordCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    });
  }, []);

  return {
    user,
    t,
    roleLabel,
    emailVerifiedLabel,
    memberSince,
    passwordCardRef,
    scrollPasswordCardIntoView,
  };
}
