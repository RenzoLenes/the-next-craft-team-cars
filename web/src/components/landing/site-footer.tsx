import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCta() {
  return (
    <section
      id="cta"
      className="scroll-mt-20 border-t border-[var(--fleet-border)] bg-[var(--fleet-fg)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 md:flex-row md:items-end md:justify-between md:py-28">
        <div className="max-w-xl">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wide text-white uppercase md:text-3xl">
            Accede al centro de control
          </h2>
          <p className="mt-4 font-[family-name:var(--font-mono)] text-sm leading-relaxed text-slate-300 md:text-base">
            Prueba el simulador de métricas ahora. La consola conectada con
            Convex llega en la siguiente iteración para flotas reales.
          </p>
        </div>
        <a
          href="#simulador"
          className={cn(
            buttonVariants({ size: "lg" }),
            "cursor-pointer bg-[var(--fleet-accent)] px-5 text-white hover:bg-[var(--fleet-accent)]/90"
          )}
        >
          Abrir simulador
        </a>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--fleet-fg)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.14em] text-white uppercase">
          Fleet Care
        </p>
        <p className="font-[family-name:var(--font-mono)] text-xs text-slate-400">
          IoT de flota · métricas · señales de control
        </p>
      </div>
    </footer>
  );
}
