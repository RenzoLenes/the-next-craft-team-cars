import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(145deg,var(--fleet-hero-from)_0%,var(--fleet-hero-via)_45%,var(--fleet-hero-to)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:48px_48px] motion-safe:animate-[fleet-grid_28s_linear_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-full max-w-3xl bg-[radial-gradient(ellipse_at_70%_40%,rgba(220,38,38,0.16),transparent_55%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:justify-center md:pb-24 md:pt-20">
        <div className="max-w-xl motion-safe:animate-[fleet-rise_700ms_ease-out]">
          <p className="mb-4 inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--fleet-muted)] uppercase">
            <span
              aria-hidden
              className="size-2 rounded-full bg-[var(--fleet-ok)] motion-safe:animate-pulse"
            />
            Sistema en línea
          </p>
          <p className="font-[family-name:var(--font-display)] mb-5 text-3xl font-bold tracking-[0.14em] text-[var(--fleet-fg)] uppercase sm:text-4xl md:text-5xl">
            Fleet <span className="text-[var(--fleet-accent)]">Care</span>
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-balance text-2xl font-bold leading-tight tracking-wide text-[var(--fleet-fg)] uppercase sm:text-3xl md:text-4xl">
            Supervisa tu flota de autos con IoT y señales de control
          </h1>
          <p className="mt-5 max-w-md font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[var(--fleet-muted)] sm:text-base">
            Monitorea el estado técnico en tiempo real, anticipa fallas y emite
            señales claras cuando un umbral se cruza.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#simulador"
              className={cn(
                buttonVariants({ size: "lg" }),
                "cursor-pointer bg-[var(--fleet-accent)] px-5 text-white hover:bg-[var(--fleet-accent)]/90"
              )}
            >
              Ver simulador
            </a>
            <a
              href="#capacidades"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "cursor-pointer border-[var(--fleet-border)] bg-white/70 px-5 backdrop-blur-sm"
              )}
            >
              Cómo funciona
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-[18%] right-[-8%] hidden w-[58%] md:block lg:right-0 lg:w-[52%]"
      >
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <svg
      viewBox="0 0 640 520"
      className="h-full w-full motion-safe:animate-[fleet-drift_12s_ease-in-out_infinite]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="40"
        y="48"
        width="560"
        height="400"
        rx="8"
        fill="#0F172A"
        opacity="0.92"
      />
      <rect x="64" y="80" width="220" height="14" rx="2" fill="#334155" />
      <rect x="64" y="110" width="140" height="8" rx="2" fill="#64748B" />
      <text
        x="420"
        y="92"
        fill="#34D399"
        fontSize="12"
        fontFamily="ui-monospace, monospace"
      >
        LIVE
      </text>

      <rect x="64" y="150" width="152" height="88" rx="4" fill="#1E293B" />
      <rect x="76" y="166" width="90" height="8" rx="2" fill="#94A3B8" />
      <text
        x="76"
        y="214"
        fill="#F8FAFC"
        fontSize="26"
        fontFamily="ui-monospace, monospace"
      >
        12
      </text>
      <text
        x="120"
        y="214"
        fill="#94A3B8"
        fontSize="12"
        fontFamily="ui-monospace, monospace"
      >
        activos
      </text>

      <rect x="232" y="150" width="152" height="88" rx="4" fill="#1E293B" />
      <rect x="244" y="166" width="88" height="8" rx="2" fill="#94A3B8" />
      <text
        x="244"
        y="214"
        fill="#FCA5A5"
        fontSize="26"
        fontFamily="ui-monospace, monospace"
      >
        3
      </text>
      <text
        x="274"
        y="214"
        fill="#94A3B8"
        fontSize="12"
        fontFamily="ui-monospace, monospace"
      >
        alertas
      </text>

      <rect x="400" y="150" width="168" height="88" rx="4" fill="#1E293B" />
      <rect x="412" y="166" width="100" height="8" rx="2" fill="#94A3B8" />
      <text
        x="412"
        y="214"
        fill="#F8FAFC"
        fontSize="26"
        fontFamily="ui-monospace, monospace"
      >
        99.2%
      </text>

      <polyline
        points="80,360 140,340 190,348 250,300 310,312 370,270 430,286 490,240 550,250"
        stroke="#DC2626"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="80,390 150,380 210,386 280,360 350,368 420,340 490,348 550,320"
        stroke="#64748B"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}
