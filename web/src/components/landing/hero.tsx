import Image from "next/image";

/** Bus al anochecer — Unsplash. Verificada antes de fijarla. */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2400&q=72";

/** Lecturas numéricas por muestra, contadas del schema de telemetryReadings. */
const SIGNAL_COUNT = 12;
/** Cadencia real del generador (simulator/generator/src/generator.ts). */
const SAMPLE_RATE = "1,5 s";

const readings = [
  "Ajuste de combustible",
  "Temperatura de refrigerante",
  "Voltaje de batería",
  "Carga del motor",
];

export function Hero() {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-[#0b1114]">
      <Image
        src={HERO_IMAGE}
        alt="Un bus detenido al anochecer con los faros encendidos, en una carretera de montaña"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,20,0.72)_0%,rgba(11,17,20,0.34)_38%,rgba(11,17,20,0.86)_100%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1200px] flex-col justify-end px-6 pt-32 pb-10 md:pb-14">
        {/* dato superior derecho */}
        <div className="pointer-events-none absolute top-28 right-6 hidden text-right md:block">
          <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.02em] text-white lg:text-4xl">
            {SAMPLE_RATE}
          </p>
          <p className="font-[family-name:var(--font-mono)] mt-1 text-[11px] tracking-[0.14em] text-white/60 uppercase">
            Frecuencia de muestreo
          </p>
        </div>

        <div className="max-w-3xl">
          <h1 className="font-[family-name:var(--font-display)] text-[2.6rem] leading-[0.98] font-extrabold tracking-[-0.03em] text-balance text-white sm:text-6xl lg:text-7xl">
            El testigo se enciende
            <span className="block text-white/55">cuando ya es tarde.</span>
          </h1>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <a
              href="#cta"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white py-2.5 pr-2.5 pl-5 text-sm font-semibold text-[#0b1114] transition-transform active:translate-y-px"
            >
              Acceder al centro de control
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-[var(--fleet-accent)] text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <Arrow />
              </span>
            </a>
            <a
              href="#simulador"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 py-2.5 pr-2.5 pl-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 active:translate-y-px"
            >
              Ver el simulador
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <Arrow />
              </span>
            </a>
          </div>
        </div>

        {/* fila inferior: dato + explicacion */}
        <div className="mt-14 grid gap-8 border-t border-white/15 pt-8 md:grid-cols-[auto_1fr] md:gap-16">
          <div>
            <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[-0.02em] text-white lg:text-5xl">
              {SIGNAL_COUNT}
            </p>
            <p className="font-[family-name:var(--font-mono)] mt-1 text-[11px] tracking-[0.14em] text-white/60 uppercase">
              Señales por lectura
            </p>
          </div>
          <div className="max-w-[62ch] md:justify-self-end">
            <p className="text-[15px] leading-relaxed text-white/75">
              Cada unidad lleva un dispositivo en el puerto OBD-II. Fleet Care
              aprende cómo se comporta un motor sano y avisa en cuanto uno deja
              de parecerse a sí mismo: semanas antes de que se encienda un
              testigo, y mucho antes de que el bus quede varado con pasajeros
              dentro.
            </p>
          </div>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {readings.map((reading) => (
            <li
              key={reading}
              className="font-[family-name:var(--font-mono)] rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[11px] tracking-wide text-white/80 backdrop-blur-sm"
            >
              {reading}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 9L9 3M9 3H4.5M9 3v4.5" />
    </svg>
  );
}
