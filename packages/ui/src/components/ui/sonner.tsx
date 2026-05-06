"use client";

import { useTheme } from "@teispace/next-themes";
import type { ReactElement } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Renders the Sonner toast viewport; mount once inside ThemeProvider.
 */
export function Toaster(props: ToasterProps): ReactElement {
  const { theme } = useTheme();

  return (
    <Sonner
      className="toaster group"
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}
