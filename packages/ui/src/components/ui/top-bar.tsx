"use client";

import * as React from "react";

import { cn } from "../../lib/utils.ts";

export type TopBarProps = {
  children?: React.ReactNode;
  className?: string;
  trailing?: React.ReactNode;
};

export function TopBar({ trailing, children, className }: TopBarProps) {
  const hasMenu = children != null && children !== false;

  return (
    <div
      className={cn(
        "flex h-14 w-full items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      {hasMenu ? (
        <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      ) : null}
      {trailing != null && trailing !== false ? (
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {trailing}
        </div>
      ) : null}
    </div>
  );
}
