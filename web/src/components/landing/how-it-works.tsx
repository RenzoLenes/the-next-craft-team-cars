const steps = [
  {
    title: "Métricas en vivo",
    body: "Velocidad, batería, temperatura y estado de cada unidad en una sola vista operativa.",
  },
  {
    title: "Umbrales claros",
    body: "Define límites por flota o por vehículo. Cuando se cruzan, el sistema marca el evento.",
  },
  {
    title: "Señales de control",
    body: "Emite acciones —alerta, límite o corte— con traza visible para el equipo de operación.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 border-t border-[var(--signal-border)] bg-[var(--signal-bg)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wide text-[var(--signal-fg)] uppercase md:text-3xl">
          Cómo funciona
        </h2>
        <p className="mt-3 max-w-xl font-[family-name:var(--font-mono)] text-sm text-[var(--signal-muted)] md:text-base">
          De la telemetría a la acción: medir, decidir y señalar.
        </p>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              <span className="font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.25em] text-[var(--signal-accent)] uppercase">
                0{index + 1}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold tracking-wide text-[var(--signal-fg)] uppercase">
                {step.title}
              </h3>
              <p className="mt-3 font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[var(--signal-muted)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
