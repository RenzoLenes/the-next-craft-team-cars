const signals = [
  {
    code: "NOMINAL",
    tone: "ok" as const,
    title: "Dentro de lo esperado",
    body: "Las lecturas coinciden con el comportamiento aprendido para estas condiciones. No hay nada que hacer, y decirlo también es información.",
  },
  {
    code: "DESVIACIÓN",
    tone: "warn" as const,
    title: "Ya no se parece a sí mismo",
    body: "El motor se aparta de su propio patrón de forma sostenida. Todavía no hay código de falla ni luz en el tablero. Esta es la ventana donde una reparación es barata.",
  },
  {
    code: "CRÍTICO",
    tone: "crit" as const,
    title: "Umbral duro cruzado",
    body: "La computadora del auto encendió el testigo y emitió un código. A esta altura el daño ya empezó; el aviso sirve para acotarlo, no para evitarlo.",
  },
] as const;

const toneColor = {
  ok: "var(--fleet-ok)",
  warn: "var(--fleet-warn)",
  crit: "var(--fleet-crit)",
} as const;

export function ControlSignals() {
  return (
    <section
      id="senales"
      className="scroll-mt-20 border-t border-[var(--fleet-border)] bg-[var(--fleet-panel)]"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-12">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.02em] text-balance text-[var(--fleet-fg)] md:col-span-5 md:text-4xl">
            Tres estados, y solo uno merece susto
          </h2>
          <p className="max-w-[58ch] self-end text-[15px] leading-relaxed text-[var(--fleet-muted)] md:col-span-6 md:col-start-7">
            El rojo está reservado. No es el color de la marca ni el de los
            botones: aparece únicamente cuando algo cruzó un umbral duro. Si
            todo grita, nada avisa.
          </p>
        </div>

        <ul className="mt-14 flex flex-col">
          {signals.map((signal) => (
            <li
              key={signal.code}
              className="grid gap-3 border-t border-[var(--fleet-border)] py-8 md:grid-cols-12 md:gap-10"
            >
              <div className="flex items-center gap-2.5 md:col-span-3">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: toneColor[signal.tone] }}
                />
                <span
                  className="font-[family-name:var(--font-mono)] text-xs font-bold tracking-[0.2em] uppercase"
                  style={{ color: toneColor[signal.tone] }}
                >
                  {signal.code}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-[-0.015em] text-[var(--fleet-fg)] md:col-span-4">
                {signal.title}
              </h3>
              <p className="max-w-[60ch] text-[15px] leading-relaxed text-[var(--fleet-muted)] md:col-span-5">
                {signal.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
