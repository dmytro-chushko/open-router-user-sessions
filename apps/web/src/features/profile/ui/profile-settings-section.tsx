import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

type ProfileSettingsSectionProps = ComponentPropsWithoutRef<"section"> & {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  children: ReactNode;
};

export const ProfileSettingsSection = forwardRef<
  HTMLElement,
  ProfileSettingsSectionProps
>(function ProfileSettingsSection(
  { title, description, variant = "default", className, children, ...props },
  ref,
) {
  const isDestructive = variant === "destructive";

  return (
    <section
      ref={ref}
      className={[
        "grid gap-6 py-8 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]",
        isDestructive
          ? "bg-card rounded-xl border border-destructive/40 p-6 shadow-sm"
          : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div className="space-y-1.5">
        <h2
          className={
            isDestructive
              ? "text-lg leading-none font-semibold text-destructive"
              : "text-lg leading-none font-semibold"
          }
        >
          {title}
        </h2>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
});
