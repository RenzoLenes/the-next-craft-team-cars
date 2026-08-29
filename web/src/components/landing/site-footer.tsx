import Image from "next/image";

import { PillLink } from "@/components/landing/pill-link";

/** Cadencia real del generador y campos numéricos de telemetryReadings. */
const SAMPLE_RATE = "1,5 s";
const SIGNAL_COUNT = 12;

export function FinalCta() {
  return (
    <section
      id="cta"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[var(--fleet-bg)]"
    >
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-24 text-center md:pt-32">
        <h2 className="font-[family-name:var(--font-display)] mx-auto max-w-[22ch] text-3xl leading-[1.05] font-semibold tracking-[-0.025em] text-balance text-[var(--fleet-fg)] md:text-[2.8rem]">
          Que ninguna unidad se entere tarde.
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[var(--fleet-muted)]">
          Detección de desviación sobre telemetría OBD-II, para flotas de
          transporte.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <PillLink href="/dashboard" variant="dark">
            Abrir el centro de control
          </PillLink>
          <PillLink href="#simulador" variant="light">
            Ver el simulador
          </PillLink>
        </div>
      </div>

      <div className="relative mt-[-3rem] h-[420px] md:mt-[-4rem] md:h-[520px]">
        <Image
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2400&q=70"
          alt="Bus detenido al anochecer con los faros encendidos, en una carretera de montaña"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,var(--fleet-bg)_0%,rgba(247,249,250,0.55)_28%,rgba(247,249,250,0)_60%)]"
        />
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[var(--fleet-bg)]">
      <div className="mx-auto max-w-[1200px] px-6 pt-16">
        <div className="grid gap-6 rounded-xl border border-[var(--fleet-border)] bg-[var(--fleet-surface)] p-6 shadow-[0_18px_40px_-30px_rgba(18,24,27,0.35)] md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-[-0.02em] text-[var(--fleet-fg)] md:text-2xl">
              ¿Lista tu flota para avisar antes?
            </p>
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-[family-name:var(--font-mono)] text-[11px] tracking-wide">
              <div className="flex items-center gap-2 text-[var(--fleet-ok)]">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-[var(--fleet-ok)]"
                />
                <dt className="sr-only">Estado</dt>
                <dd className="uppercase">Motor de reglas activo</dd>
              </div>
              <div className="flex gap-1.5 text-[var(--fleet-muted)]">
                <dt>Muestreo:</dt>
                <dd className="text-[var(--fleet-fg)]">cada {SAMPLE_RATE}</dd>
              </div>
              <div className="flex gap-1.5 text-[var(--fleet-muted)]">
                <dt>Señales por lectura:</dt>
                <dd className="text-[var(--fleet-fg)]">{SIGNAL_COUNT}</dd>
              </div>
            </dl>
          </div>
          <PillLink href="/dashboard" variant="dark">
            Abrir el centro de control
          </PillLink>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <FooterColumn
          title="Producto"
          links={["Monitoreo", "Alertas", "Simulador", "Centro de control"]}
        />
        <FooterColumn
          title="Señales"
          links={["Nominal", "Desviación", "Umbral crítico"]}
        />
        <FooterColumn
          title="Lecturas"
          links={[
            "Ajuste de combustible",
            "Refrigerante",
            "Voltaje",
            "Carga del motor",
          ]}
        />
        <FooterColumn
          title="Créditos"
          links={["Video: Oskar Gross, Pexels", "Fotografías: Unsplash"]}
        />
      </div>

      <div className="border-t border-[var(--fleet-border)]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--fleet-accent)]">
            Telemetría OBD-II para flotas de transporte.
          </p>
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--fleet-muted)]">
            Fleet Care
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--fleet-accent)] uppercase">
        {title}
      </p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link} className="text-[13px] text-[var(--fleet-muted)]">
            {link}
          </li>
        ))}
      </ul>
    </div>
  );
}
