export type NavItemMatch = "exact" | "prefix";

export type NavItem = {
  id: string;
  href: string;
  match: NavItemMatch;
};
