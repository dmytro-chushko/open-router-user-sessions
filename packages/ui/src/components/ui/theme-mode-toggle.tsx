"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "./button.tsx";

export function ThemeModeToggle({
  darkLabel,
  lightLabel,
  systemLabel,
}: {
  darkLabel: string;
  lightLabel: string;
  systemLabel: string;
}) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const modes = [
    { id: "light" as const, icon: Sun, label: lightLabel },
    { id: "dark" as const, icon: Moon, label: darkLabel },
    { id: "system" as const, icon: Monitor, label: systemLabel },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="flex h-9 items-center gap-1" aria-hidden />;
  }

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
