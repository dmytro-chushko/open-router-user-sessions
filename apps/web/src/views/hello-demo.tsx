"use client";

import { useTranslations } from "next-intl";

import { useHelloWorldQuery } from "@/entities/hello";

export function HelloDemo() {
  const t = useTranslations("hello");
  const { data, isPending, isError, error } = useHelloWorldQuery();

  if (isPending) {
    return <p>{t("loading")}</p>;
  }

  if (isError) {
    return <p role="alert">{error.message}</p>;
  }

  return <p>{data.message}</p>;
}
