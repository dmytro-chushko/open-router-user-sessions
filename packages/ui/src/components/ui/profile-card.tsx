import * as React from "react";

import { cn } from "../../lib/utils.ts";

function ProfileCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="profile-card"
      className={cn(
        "bg-card text-card-foreground rounded-xl border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function ProfileCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="profile-card-header"
      className={cn("flex flex-col gap-1.5 p-6 pb-4", className)}
      {...props}
    />
  );
}

function ProfileCardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="profile-card-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

function ProfileCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="profile-card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function ProfileCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="profile-card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}

export {
  ProfileCard,
  ProfileCardContent,
  ProfileCardDescription,
  ProfileCardHeader,
  ProfileCardTitle,
};
