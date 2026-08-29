import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.2em] text-[var(--signal-fg)] uppercase transition-opacity duration-200 hover:opacity-70"
        >
          Señal
        </Link>
        <nav className="flex items-center gap-3">
          <a
            href="#demo"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "cursor-pointer text-[var(--signal-muted)]"
            )}
          >
            Demo
          </a>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "cursor-pointer text-[var(--signal-muted)]"
                )}
              >
                Entrar
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "cursor-pointer bg-[var(--signal-accent)] text-white hover:bg-[var(--signal-accent)]/90"
                )}
              >
                Empezar
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "sm" }),
                "cursor-pointer bg-[var(--signal-accent)] text-white hover:bg-[var(--signal-accent)]/90"
              )}
            >
              Consola
            </Link>
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}
