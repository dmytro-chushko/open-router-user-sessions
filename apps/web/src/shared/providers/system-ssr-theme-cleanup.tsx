"use client";

import { useLayoutEffect } from "react";

/**
 * Drops `data-ssr-theme` after hydration so OS-based SSR tokens do not outlive client theme.
 */
export function SystemSsrThemeCleanup() {
  useLayoutEffect(() => {
    document.documentElement.removeAttribute("data-ssr-theme");
  }, []);

  return null;
}
