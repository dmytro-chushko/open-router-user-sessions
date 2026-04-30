import { Sun, Moon, Monitor } from "lucide-react";

export const modes = [
  { id: "light" as const, icon: Sun, label: "Світла тема" },
  { id: "dark" as const, icon: Moon, label: "Темна тема" },
  { id: "system" as const, icon: Monitor, label: "Як у системі" },
];
