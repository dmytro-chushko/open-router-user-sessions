"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { cn } from "../../lib/utils.js";

import { Button } from "./button.js";

export type TopBarProps = {
  children?: React.ReactNode;
  className?: string;
};

function ThemeModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="flex h-9 items-center gap-1" aria-hidden />;
  }
  const modes = [
    { id: "light" as const, icon: Sun, label: "Світла тема" },
    { id: "dark" as const, icon: Moon, label: "Темна тема" },
    { id: "system" as const, icon: Monitor, label: "Як у системі" },
  ];

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-border bg-muted/30 p-1"
      role="group"
      aria-label="Режим теми"
    >
      {modes.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          type="button"
          variant={theme === id ? "secondary" : "ghost"}
          size="icon"
          className="size-8"
          aria-label={label}
          aria-pressed={theme === id}
          onClick={() => setTheme(id)}
        >
          <Icon className="size-4" />
        </Button>
      ))}
    </div>
  );
}

export function TopBar({ children, className }: TopBarProps) {
  const hasMenu = children != null && children !== false;

  return (
    <div
      role="banner"
      className={cn(
        "flex h-14 w-full items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      {hasMenu ? (
        <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      ) : null}
      <div className="ml-auto flex shrink-0 items-center">
        <ThemeModeToggle />
      </div>
    </div>
  );
}
