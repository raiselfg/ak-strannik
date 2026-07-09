import Link from "next/link";
import type { ComponentProps } from "react";

type CrudActionLinkProps = ComponentProps<typeof Link> & {
  tone?: "default" | "quiet" | "danger";
};

export function CrudActionLink({
  className = "",
  tone = "default",
  ...props
}: CrudActionLinkProps) {
  const toneClass = {
    default: "border-foreground/15 bg-foreground text-background hover:bg-foreground/85",
    quiet: "border-foreground/15 hover:bg-foreground/10",
    danger: "border-red-500/30 text-red-600 hover:bg-red-500/10",
  }[tone];

  return (
    <Link
      className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors ${toneClass} ${className}`}
      {...props}
    />
  );
}
