import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const nav = [
  { href: "#lecturas", label: "Monitoreo" },
  { href: "#integracion", label: "Integración" },
  { href: "#simulador", label: "Simulador" },
];

/** Barra flotante en píldora sobre el video, como en la referencia. */
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-5 z-20 px-4">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between rounded-xl border border-white/15 bg-[#0b1114]/45 px-3 pl-5 backdrop-blur-md">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-[-0.01em] text-white"
        >
          Fleet<span className="text-[var(--fleet-accent)]">Care</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-[13px] text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="min-h-10 cursor-pointer rounded-md px-3 text-[13px] text-white/75 transition-colors hover:bg-white/10 hover:text-white"
              >
                Entrar
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="group inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-white py-1.5 pr-1.5 pl-3.5 text-[13px] font-medium text-[#0b1114] transition-transform active:translate-y-px"
              >
                Comenzar
                <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#0b1114] text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <Arrow />
                </span>
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="group inline-flex min-h-10 items-center gap-2 rounded-lg bg-white py-1.5 pr-1.5 pl-3.5 text-[13px] font-medium text-[#0b1114] transition-transform active:translate-y-px"
            >
              Consola
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#0b1114] text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <Arrow />
              </span>
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}

function Arrow() {
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
      <path d="M3 9L9 3M9 3H4.5M9 3v4.5" />
    </svg>
  );
}
