import Image from "next/image";

/**
 * Valores nominales y umbrales tomados del codigo real:
 * - simulator/generator/src/generator.ts: coolant 90 °C (82–95), bateria 14.1 V (13.6–14.6)
 * - web/convex/telemetry.ts: COOLANT_WARN 105 / CRIT 115, BATTERY_WARN 13.2 / CRIT 12.2
 */
const cards = [
  {
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=70",
    alt: "Manos de un mecánico ajustando un motor con una llave",
    title: "Temperatura de refrigerante",
    lead: "Umbral de atención a 105 °C, crítico a 115 °C.",
    value: "90",
    unit: "°C",
    label: "Lectura nominal",
    side: "left" as const,
  },
  {
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=70",
    alt: "Conductor al volante al anochecer con el tablero iluminado",
    title: "Voltaje del sistema eléctrico",
    lead: "Atención por debajo de 13,2 V, crítico bajo 12,2 V.",
    value: "14,1",
    unit: "V",
    label: "Lectura nominal",
    side: "right" as const,
  },
];

export function Readings() {
  return (
    <section
      id="lecturas"
      className="scroll-mt-20 bg-[var(--fleet-bg)] pt-20 md:pt-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <h2 className="font-[family-name:var(--font-display)] text-3xl leading-[1.05] font-semibold tracking-[-0.025em] text-balance text-[var(--fleet-fg)] md:col-span-5 md:text-[2.6rem]">
            Salud por subsistema, no un semáforo único
          </h2>
          <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-[var(--fleet-muted)] md:col-span-6 md:col-start-7">
            <p>
              Cada lectura del puerto OBD-II alimenta dos evaluaciones a la vez.
              El motor de reglas la compara contra umbrales fijos y dispara en
              milisegundos. El modelo de desviación la compara contra lo que ese
              motor suele hacer en esas condiciones de carga y velocidad.
            </p>
            <p>
              Los umbrales son los del fabricante; el comportamiento normal se
              aprende. Por eso una unidad puede estar dentro de umbral y aun así
              en desviación sostenida. Ese es el aviso que llega semanas antes.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-[1200px] px-6 md:mt-20">
        <div className="relative isolate overflow-hidden rounded-xl">
          <Image
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1800&q=65"
            alt=""
            fill
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-[#0b1114]/70" />

          <div className="relative z-10 grid gap-5 p-5 md:grid-cols-2 md:p-8">
            {cards.map((card) => (
              <article
                key={card.title}
                className="grid overflow-hidden rounded-lg border border-white/30 bg-[var(--fleet-surface)] sm:grid-cols-2"
              >
                <div
                  className={
                    card.side === "right"
                      ? "relative min-h-56 sm:order-2"
                      : "relative min-h-56"
                  }
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 640px) 300px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between gap-10 p-6">
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-xl leading-tight font-semibold tracking-[-0.015em] text-[var(--fleet-fg)]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-[var(--fleet-muted)]">
                      {card.lead}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[var(--fleet-muted)]">
                      {card.label}
                    </p>
                    <p className="font-[family-name:var(--font-display)] mt-1 flex items-baseline gap-1.5 text-[2.4rem] leading-none font-semibold tracking-[-0.03em] text-[var(--fleet-fg)]">
                      {card.value}
                      <span className="font-[family-name:var(--font-mono)] text-sm font-normal text-[var(--fleet-muted)]">
                        {card.unit}
                      </span>
                    </p>
                    <span className="font-[family-name:var(--font-mono)] mt-3 inline-block rounded-full border border-[var(--fleet-ok)]/50 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[var(--fleet-ok)] uppercase">
                      Nominal
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
