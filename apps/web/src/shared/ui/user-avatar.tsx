"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import { User } from "lucide-react";

type UserAvatarProps = {
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClassName: Record<NonNullable<UserAvatarProps["size"]>, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-20 text-xl",
};

function getInitials(name: string | null | undefined, email: string): string {
  const source = name?.trim() || email.split("@")[0] || email;

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserAvatar({
  name,
  email,
  avatarUrl,
  size = "md",
  className,
}: UserAvatarProps) {
  const initials = getInitials(name, email);

  return (
    <Avatar
      className={[sizeClassName[size], className].filter(Boolean).join(" ")}
    >
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt="" referrerPolicy="no-referrer" />
      ) : null}
      <AvatarFallback aria-hidden="true">
        {initials.length > 0 ? initials : <User className="size-4" />}
      </AvatarFallback>
    </Avatar>
  );
}

export { getInitials };
