import { TopBar, ThemeModeToggle } from "@repo/ui";

export function WebTopBar() {
  return (
    <TopBar
      className="h-(--header-mobile-height) sm:h-(--header-tablet-height) md:h-(--header-height)"
      themeModesSwitcher={
        <ThemeModeToggle
          darkLabel="Темна тема"
          lightLabel="Світла тема"
          systemLabel="Як у системі"
        />
      }
    >
      <span className="truncate text-sm font-medium text-foreground">
        Open Router Sessions
      </span>
    </TopBar>
  );
}
