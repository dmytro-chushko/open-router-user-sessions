"use client";

import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui";
import { Menu } from "lucide-react";

import { HeaderActionsPanel } from "./header-actions-panel";

import { useMobileHeaderSheet } from "@/shared/shell/hooks/use-mobile-header-sheet";

type ThemeLabels = {
  darkLabel: string;
  lightLabel: string;
  systemLabel: string;
  ariaLabel: string;
};

type MobileMenuLabels = {
  closeLabel: string;
  openAriaLabel: string;
  title: string;
};

type SectionLabels = {
  theme: string;
  locale: string;
  account: string;
};

type MobileHeaderSheetProps = {
  themeLabels: ThemeLabels;
  mobileMenuLabels: MobileMenuLabels;
  sectionLabels: SectionLabels;
};

export function MobileHeaderSheet({
  themeLabels,
  mobileMenuLabels,
  sectionLabels,
}: MobileHeaderSheetProps) {
  const { open, setOpen } = useMobileHeaderSheet();
  const handleNavigate = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          aria-label={mobileMenuLabels.openAriaLabel}
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(100vw-2rem,20rem)] p-0"
        closeLabel={mobileMenuLabels.closeLabel}
      >
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle>{mobileMenuLabels.title}</SheetTitle>
        </SheetHeader>
        <HeaderActionsPanel
          layout="stack"
          themeLabels={themeLabels}
          sectionLabels={sectionLabels}
          onNavigate={handleNavigate}
        />
      </SheetContent>
    </Sheet>
  );
}
