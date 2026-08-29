const signals = [
  {
    code: "OK",
    title: "Operación nominal",
    body: "Las métricas están dentro de umbral. La unidad sigue en ruta sin intervención.",
  },
  {
    code: "ALERTA",
    title: "Atención requerida",
    body: "Un sensor cruzó un límite suave (velocidad, temperatura o batería). Notifica al equipo.",
  },
  {
    code: "LÍMITE",
    title: "Señal de control",
    body: "Umbral crítico. Emite una señal accionable: reducir velocidad, detener o solicitar soporte.",
  },
] as const;

export function ControlSignals() {
  return (
    <section
      id="senales"
      className="scroll-mt-20 border-t border-[var(--fleet-border)] bg-[var(--fleet-panel)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wide text-[var(--fleet-fg)] uppercase md:text-3xl">
          Señales de control
        </h2>
        <p className="mt-3 max-w-2xl font-[family-name:var(--font-mono)] text-sm text-[var(--fleet-muted)] md:text-base">
          Fleet Care no solo mide: convierte telemetría en señales claras para
          operar la flota con criterio.
        </p>

        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {signals.map((signal) => (
            <li key={signal.code}>
              <p className="font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.28em] text-[var(--fleet-accent)] uppercase">
                {signal.code}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold tracking-wide text-[var(--fleet-fg)] uppercase">
                {signal.title}
              </h3>
              <p className="mt-3 font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[var(--fleet-muted)]">
                {signal.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
