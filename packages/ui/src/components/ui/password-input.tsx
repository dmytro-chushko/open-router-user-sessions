"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";

import { cn } from "../../lib/utils.ts";

import { Button } from "./button.tsx";
import { Input } from "./input.tsx";

type PasswordInputProps = ComponentProps<typeof Input> & {
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
};

function PasswordInput({
  className,
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 h-10 w-10 text-muted-foreground hover:text-foreground"
        onClick={() => {
          setIsVisible((visible) => !visible);
        }}
        aria-label={isVisible ? hidePasswordLabel : showPasswordLabel}
        aria-pressed={isVisible}
      >
        {isVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </Button>
    </div>
  );
}

export { PasswordInput };
