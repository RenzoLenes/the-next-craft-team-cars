import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(160deg,var(--fleet-hero-from)_0%,var(--fleet-hero-via)_52%,var(--fleet-hero-to)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(18,24,27,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,27,0.05)_1px,transparent_1px)] [background-size:56px_56px]"
      />

      <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pt-28 pb-16 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:pt-24 md:pb-24">
        <div className="motion-safe:animate-[fleet-rise_700ms_ease-out]">
          <p className="mb-6 inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--fleet-muted)] uppercase">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-[var(--fleet-ok)] motion-safe:animate-pulse"
            />
            Telemetría en vivo
          </p>

          <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[1.05] font-extrabold tracking-[-0.025em] text-balance text-[var(--fleet-fg)] sm:text-5xl md:text-[3.4rem]">
            El tablero avisa cuando ya se rompió.
            <span className="mt-2 block text-[var(--fleet-accent)]">
              Nosotros, antes.
            </span>
          </h1>

          <p className="mt-6 max-w-[54ch] text-[15px] leading-relaxed text-[var(--fleet-muted)] md:text-base">
            Un dispositivo lee el puerto OBD-II de cada vehículo. Fleet Care
            aprende cómo se comporta el motor cuando está sano y avisa en cuanto
            deja de parecerse a sí mismo, semanas antes de que la computadora
            del auto encienda una luz.
          </p>

          <div className="mt-9">
            <a
              href="#simulador"
              className={cn(
                buttonVariants({ size: "lg" }),
                "cursor-pointer bg-[var(--fleet-accent)] px-6 text-white hover:bg-[var(--fleet-accent)]/90",
              )}
            >
              Ver el simulador
            </a>
          </div>
        </div>

        <div className="motion-safe:animate-[fleet-rise_700ms_ease-out_140ms_both]">
          <DriftPanel />
        </div>
      </div>
    </section>
  );
}

/**
 * La ventana entre "ya no es normal" y "el auto enciende la luz".
 * Los valores son ilustrativos de la mecánica del producto, no una medición.
 */
function DriftPanel() {
  return (
    <figure className="rounded-md border border-[var(--fleet-border)] bg-[var(--fleet-surface)] p-5 shadow-[0_18px_40px_-28px_rgba(18,24,27,0.4)]">
      <figcaption className="mb-4 flex items-baseline justify-between gap-3">
        <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--fleet-muted)] uppercase">
          Ajuste de combustible
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--fleet-muted)]">
          ilustrativo
        </span>
      </figcaption>

      <svg
        viewBox="0 0 480 248"
        className="h-auto w-full"
        role="img"
        aria-label="La desviación del ajuste de combustible sube de forma sostenida. Fleet Care avisa cuando sale de la banda normal; la computadora del auto solo reacciona mucho después, al cruzar su umbral fijo."
      >
        <title>Ventana de anticipación</title>

        <rect
          x="46"
          y="150"
          width="418"
          height="42"
          fill="var(--fleet-ok)"
          opacity="0.12"
        />
        <text
          x="52"
          y="166"
          fontSize="9"
          fill="var(--fleet-ok)"
          fontFamily="var(--font-mono)"
        >
          BANDA NORMAL
        </text>

        <line
          x1="46"
          y1="52"
          x2="464"
          y2="52"
          stroke="var(--fleet-crit)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <text
          x="52"
          y="45"
          fontSize="9"
          fill="var(--fleet-crit)"
          fontFamily="var(--font-mono)"
        >
          UMBRAL DEL AUTO
        </text>

        <line x1="46" y1="214" x2="464" y2="214" stroke="var(--fleet-border)" />

        <polyline
          points="46,178 92,174 138,169 184,158 230,142 276,124 322,98 368,74 414,52 460,38"
          fill="none"
          stroke="var(--fleet-warn)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="276" cy="124" r="5" fill="var(--fleet-accent)" />
        <line
          x1="276"
          y1="124"
          x2="276"
          y2="214"
          stroke="var(--fleet-accent)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x="286"
          y="118"
          fontSize="10"
          fontWeight="700"
          fill="var(--fleet-accent)"
          fontFamily="var(--font-mono)"
        >
          avisamos aquí
        </text>

        <circle cx="414" cy="52" r="5" fill="var(--fleet-crit)" />
        <line
          x1="414"
          y1="52"
          x2="414"
          y2="214"
          stroke="var(--fleet-crit)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        <line
          x1="276"
          y1="228"
          x2="414"
          y2="228"
          stroke="var(--fleet-accent)"
          strokeWidth="1.5"
        />
        <text
          x="298"
          y="242"
          fontSize="10"
          fill="var(--fleet-accent)"
          fontFamily="var(--font-mono)"
        >
          tiempo ganado
        </text>
      </svg>
    </figure>
  );
}
