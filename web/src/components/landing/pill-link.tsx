import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Píldora con flecha en círculo — el CTA de toda la landing. */
export function PillLink({
  href,
  variant,
  children,
  className,
}: {
  href: string;
  variant: "dark" | "light" | "ghost";
  children: ReactNode;
  className?: string;
}) {
  const shell = {
    dark: "bg-[#0b1114] text-white hover:bg-[#0b1114]/90",
    light:
      "border border-[var(--fleet-border)] bg-[var(--fleet-surface)] text-[var(--fleet-fg)] hover:bg-[var(--fleet-panel)]",
    ghost:
      "border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/12",
  }[variant];

  const bubble = {
    dark: "bg-white/15 text-white",
    light: "bg-[#0b1114] text-white",
    ghost: "bg-white/15 text-white",
  }[variant];

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2.5 rounded-lg py-2 pr-2 pl-4 text-sm font-medium transition-transform active:translate-y-px",
        shell,
        className,
      )}
    >
      {children}
      <span
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-md transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
          bubble,
        )}
      >
        <Arrow />
      </span>
    </Link>
  );
}

/** Flecha decorativa de los CTA. Oculta al árbol de accesibilidad; el <title> satisface el lint. */
export function Arrow() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <title>Flecha</title>
      <path d="M3 9L9 3M9 3H4.5M9 3v4.5" />
    </svg>
  );
}
