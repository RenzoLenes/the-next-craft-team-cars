const capabilities = [
  {
    kicker: "Lectura",
    title: "Habla OBD-II, no un formato inventado",
    body: "El dispositivo lee los PID reales del modo 01: régimen del motor, carga calculada, flujo de aire, ajuste de combustible, voltaje. Los mismos que consulta un escáner de taller, en cada unidad de la flota.",
  },
  {
    kicker: "Aprendizaje",
    title: "Aprende qué es normal para cada unidad",
    body: "Un umbral fijo grita en cuesta arriba y calla cuando un motor que suele ir en -8 se va a +9. El modelo compara contra lo esperado para esa velocidad, carga y temperatura, no contra un número de tabla igual para toda la flota.",
  },
  {
    kicker: "Traducción",
    title: "Y lo dice en castellano",
    body: "Un código de falla es una sigla. Fleet Care responde lo que de verdad necesita saber el jefe de operaciones: qué le pasa a la unidad, si puede terminar la ruta, y cuánto cuesta atenderlo hoy frente a cuánto cuesta un bus parado.",
  },
] as const;

const fleetStatus = [
  { unit: "Unidad 01", status: "Dentro de umbral", tone: "ok" as const },
  { unit: "Unidad 02", status: "Desviación sostenida", tone: "warn" as const },
  { unit: "Unidad 03", status: "Dentro de umbral", tone: "ok" as const },
  { unit: "Unidad 04", status: "Umbral crítico", tone: "crit" as const },
];

const toneColor = {
  ok: "var(--fleet-ok)",
  warn: "var(--fleet-warn)",
  crit: "var(--fleet-crit)",
} as const;

export function Capabilities() {
  return (
    <section
      id="capacidades"
      className="scroll-mt-20 border-t border-[var(--fleet-border)] bg-[var(--fleet-bg)]"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <h2 className="font-[family-name:var(--font-display)] max-w-[18ch] text-3xl font-extrabold tracking-[-0.02em] text-balance text-[var(--fleet-fg)] md:text-4xl">
          Tres pasos entre un sensor y una unidad que no se detiene
        </h2>

        <ol className="mt-16 flex flex-col gap-14 md:gap-20">
          {capabilities.map((item, index) => (
            <li
              key={item.title}
              className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-10"
              style={{
                // zig-zag: el peso visual alterna de lado
                ["--offset" as string]: index % 2 === 1 ? "1" : "0",
              }}
            >
              <div
                className={
                  index % 2 === 1
                    ? "md:col-span-4 md:col-start-6"
                    : "md:col-span-4 md:col-start-1"
                }
              >
                <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-[0.2em] text-[var(--fleet-accent)] uppercase">
                  {String(index + 1).padStart(2, "0")} · {item.kicker}
                </span>
                <h3 className="font-[family-name:var(--font-display)] mt-3 text-xl font-bold tracking-[-0.015em] text-[var(--fleet-fg)] md:text-2xl">
                  {item.title}
                </h3>
              </div>
              <p
                className={
                  index % 2 === 1
                    ? "max-w-[62ch] text-[15px] leading-relaxed text-[var(--fleet-muted)] md:col-span-5 md:col-start-1 md:row-start-1"
                    : "max-w-[62ch] text-[15px] leading-relaxed text-[var(--fleet-muted)] md:col-span-5 md:col-start-7"
                }
              >
                {item.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-20 border-t border-[var(--fleet-border)] pt-8">
          <p className="font-[family-name:var(--font-mono)] mb-5 text-[11px] tracking-[0.18em] text-[var(--fleet-muted)] uppercase">
            Estado de flota
          </p>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {fleetStatus.map((row) => (
              <li
                key={row.unit}
                className="flex items-start gap-2.5 border-t border-[var(--fleet-border)] pt-4"
              >
                <span
                  aria-hidden
                  className="mt-1.5 size-2 shrink-0 rounded-full"
                  style={{ background: toneColor[row.tone] }}
                />
                <span className="flex flex-col gap-0.5">
                  <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[var(--fleet-muted)] uppercase">
                    {row.unit}
                  </span>
                  <span
                    className="font-[family-name:var(--font-mono)] text-sm font-bold"
                    style={{ color: toneColor[row.tone] }}
                  >
                    {row.status}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
