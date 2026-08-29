import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em] text-[var(--fleet-fg)] uppercase transition-opacity duration-200 hover:opacity-70"
        >
          Fleet <span className="text-[var(--fleet-accent)]">Care</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <a
            href="#capacidades"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "cursor-pointer text-[var(--fleet-muted)]"
            )}
          >
            Monitoreo
          </a>
          <a
            href="#senales"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "cursor-pointer text-[var(--fleet-muted)]"
            )}
          >
            Alertas
          </a>
          <a
            href="#senales"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "cursor-pointer text-[var(--fleet-muted)]"
            )}
          >
            Seguridad
          </a>
        </nav>
        <nav className="flex items-center gap-2">
          <a
            href="#simulador"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "cursor-pointer text-[var(--fleet-muted)]"
            )}
          >
            Simulador
          </a>
          <a
            href="#cta"
            className={cn(
              buttonVariants({ size: "sm" }),
              "cursor-pointer bg-[var(--fleet-accent)] text-white hover:bg-[var(--fleet-accent)]/90"
            )}
          >
            Comenzar
          </a>
        </nav>
      </div>
    </header>
  );
}
