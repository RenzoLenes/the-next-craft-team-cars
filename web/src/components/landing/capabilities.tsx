const capabilities = [
  {
    title: "Monitoreo 24/7",
    body: "Supervisa todos tus autos en tiempo real con datos precisos de sensores IoT: velocidad, batería, temperatura y más.",
  },
  {
    title: "Alertas inteligentes",
    body: "Recibe notificaciones instantáneas sobre condiciones críticas y fallas potenciales antes de que escalen.",
  },
  {
    title: "Mantenimiento predictivo",
    body: "Anticipa necesidades de servicio con umbrales y tendencias para evitar paradas costosas en la flota.",
  },
] as const;

const fleetStatus = [
  { unit: "Unidad 01", status: "Operativo", tone: "ok" as const },
  { unit: "Unidad 02", status: "Mantenimiento requerido", tone: "warn" as const },
  { unit: "Unidad 03", status: "Operativo", tone: "ok" as const },
  { unit: "Unidad 04", status: "Señal LÍMITE", tone: "limit" as const },
];

export function Capabilities() {
  return (
    <section
      id="capacidades"
      className="scroll-mt-20 border-t border-[var(--fleet-border)] bg-[var(--fleet-bg)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wide text-[var(--fleet-fg)] uppercase md:text-3xl">
          Control total de tu flota
        </h2>
        <p className="mt-3 max-w-2xl font-[family-name:var(--font-mono)] text-sm text-[var(--fleet-muted)] md:text-base">
          Visualiza datos críticos, gestiona alertas y toma decisiones desde un
          centro de comando unificado. Todo lo necesario para operar al máximo
          rendimiento.
        </p>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {capabilities.map((item, index) => (
            <li key={item.title}>
              <span className="font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.25em] text-[var(--fleet-accent)] uppercase">
                0{index + 1}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold tracking-wide text-[var(--fleet-fg)] uppercase">
                {item.title}
              </h3>
              <p className="mt-3 font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[var(--fleet-muted)]">
                {item.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fleetStatus.map((row) => (
            <div
              key={row.unit}
              className="border border-[var(--fleet-border)] bg-white px-4 py-5"
            >
              <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--fleet-muted)] uppercase">
                {row.unit}
              </p>
              <p
                className={cnStatus(row.tone)}
              >
                {row.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function cnStatus(tone: "ok" | "warn" | "limit") {
  const base =
    "mt-2 font-[family-name:var(--font-mono)] text-sm font-medium";
  if (tone === "warn") return `${base} text-[var(--fleet-warn)]`;
  if (tone === "limit") return `${base} text-[var(--fleet-accent)]`;
  return `${base} text-[var(--fleet-ok)]`;
}
