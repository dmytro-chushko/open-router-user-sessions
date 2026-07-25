export function adminUserQueryKey(userId: string) {
  return ["admin", "users", userId] as const;
}
