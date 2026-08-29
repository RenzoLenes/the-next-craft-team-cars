import { PillLink } from "@/components/landing/pill-link";

/** Cadencia real del generador (simulator/generator/src/generator.ts). */
const SAMPLE_RATE = "1,5 s";
/** Campos numéricos por lectura, contados del schema de telemetryReadings. */
const SIGNAL_COUNT = 12;

const readings = [
  "Ajuste de combustible",
  "Temperatura de refrigerante",
  "Voltaje de batería",
  "Carga del motor",
];

export function Hero() {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-[#0b1114]">
      {/* Dron sobre un bus en curva de bosque — Pexels, Oskar Gross. Transcodificado y servido local. */}
      <video
        className="absolute inset-0 size-full object-cover"
        src="/hero.mp4"
        poster="/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,20,0.66)_0%,rgba(11,17,20,0.28)_40%,rgba(11,17,20,0.82)_100%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1200px] flex-col justify-between px-6 pt-32 pb-8 md:pb-10">
        {/* ── dato superior derecho, con línea guía punteada ── */}
        <div className="hidden justify-end md:flex">
          <div className="w-full max-w-sm text-right">
            <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[-0.02em] text-white lg:text-5xl">
              {SAMPLE_RATE}
            </p>
            <p className="font-[family-name:var(--font-mono)] mt-1 text-[11px] tracking-[0.14em] text-white/60 uppercase">
              Frecuencia de muestreo
            </p>
            <div className="mt-4 flex items-center justify-end gap-0">
              <span aria-hidden className="size-1.5 rounded-full bg-white/70" />
              <span
                aria-hidden
                className="h-px w-full border-t border-dotted border-white/45"
              />
            </div>
          </div>
        </div>

        {/* ── bloque central: titular + CTAs ── */}
        <div className="-mt-6 md:-mt-16">
          <h1 className="font-[family-name:var(--font-display)] max-w-[14ch] text-[2.6rem] leading-[0.98] font-semibold tracking-[-0.03em] text-balance text-white sm:text-6xl lg:text-[4.6rem]">
            El testigo se enciende cuando ya es tarde.
          </h1>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <PillLink href="/dashboard" variant="light">
              Acceder al centro de control
            </PillLink>
            <PillLink href="#simulador" variant="ghost">
              Ver el simulador
            </PillLink>
          </div>
        </div>

        {/* ── fila inferior: dato con guía + texto con regla vertical + chips ── */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-end md:gap-16">
          <div>
            <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[-0.02em] text-white lg:text-5xl">
              {SIGNAL_COUNT}
            </p>
            <p className="font-[family-name:var(--font-mono)] mt-1 text-[11px] tracking-[0.14em] text-white/60 uppercase">
              Señales por lectura
            </p>
            <div className="mt-4 hidden items-center md:flex">
              <span
                aria-hidden
                className="h-px w-full border-t border-dotted border-white/45"
              />
              <span aria-hidden className="size-1.5 rounded-full bg-white/70" />
            </div>
            <ul className="mt-10 flex flex-wrap gap-2">
              {readings.map((reading) => (
                <li
                  key={reading}
                  className="rounded-md border border-white/20 bg-white/5 px-3.5 py-1.5 text-[12px] text-white/85 backdrop-blur-sm"
                >
                  {reading}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative max-w-[52ch] md:border-l md:border-dotted md:border-white/45 md:pl-6">
            <span
              aria-hidden
              className="absolute -top-1 -left-[3.5px] hidden size-1.5 rounded-full bg-white/70 md:block"
            />
            <p className="font-[family-name:var(--font-display)] text-lg font-medium tracking-[-0.01em] text-white">
              Lee cada unidad. Avisa antes del testigo.
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-white/72">
              Cada bus lleva un dispositivo en el puerto OBD-II. Fleet Care
              aprende cómo se comporta un motor sano y avisa en cuanto uno deja
              de parecerse a sí mismo: semanas antes de que se encienda un
              testigo, y mucho antes de que quede varado con pasajeros dentro.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
