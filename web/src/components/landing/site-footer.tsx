import Image from "next/image";

/** Conductor al volante al anochecer — Unsplash. Verificada antes de fijarla. */
const CTA_IMAGE =
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=2000&q=72";

export function FinalCta() {
  return (
    <section
      id="cta"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#0b1114]"
    >
      <Image
        src={CTA_IMAGE}
        alt="Conductor al volante al anochecer, con el tablero iluminado"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,20,0.88)_0%,rgba(11,17,20,0.62)_50%,rgba(11,17,20,0.92)_100%)]"
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-24 text-center md:py-32">
        <h2 className="font-[family-name:var(--font-display)] mx-auto max-w-[20ch] text-3xl leading-[1.05] font-extrabold tracking-[-0.025em] text-balance text-white md:text-5xl">
          Que la unidad vuelva al taller por su cuenta.
        </h2>
        <p className="mx-auto mt-5 max-w-[56ch] text-[15px] leading-relaxed text-white/70">
          El simulador reproduce una flota con fallas inyectadas para que veas
          la detección tal como ocurre en ruta.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          <a
            href="/dashboard"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white py-2.5 pr-2.5 pl-5 text-sm font-semibold text-[#0b1114] transition-transform active:translate-y-px"
          >
            Abrir el centro de control
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-[var(--fleet-accent)] text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <Arrow />
            </span>
          </a>
          <a
            href="#simulador"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 py-2.5 pr-2.5 pl-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 active:translate-y-px"
          >
            Ver el simulador
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <Arrow />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0b1114]">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em] text-white uppercase">
            Fleet <span className="text-[var(--fleet-accent)]">Care</span>
          </p>
          <p className="mt-3 max-w-[30ch] text-[13px] leading-relaxed text-white/50">
            Telemetría OBD-II y detección de desviación para flotas de
            transporte.
          </p>
        </div>

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
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-white/40">
            Fotografías de Unsplash.
          </p>
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-white/40">
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
          <li key={link} className="text-[13px] text-white/60">
            {link}
          </li>
        ))}
      </ul>
    </div>
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
