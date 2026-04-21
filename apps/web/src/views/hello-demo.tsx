"use client";

import { useHelloWorldQuery } from "@/entities/hello";

export function HelloDemo() {
  const { data, isPending, isError, error } = useHelloWorldQuery();

  if (isPending) {
    return <p>Loading…</p>;
  }

  if (isError) {
    return <p role="alert">{error.message}</p>;
  }

  return <p>{data.message}</p>;
}
