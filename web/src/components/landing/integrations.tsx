import Image from "next/image";

const items = [
  {
    tag: "Dispositivo",
    title: "Un lector OBD-II por unidad",
    body: "Se conecta al puerto de diagnóstico que toda unidad fabricada después de 2008 ya trae. Lee los PID del modo 01 y los códigos del modo 03 cada 1,5 segundos, sin cableado nuevo.",
    image: "/aerial-bus.jpg",
    alt: "Vista aérea de un bus tomando una curva en una carretera de bosque",
  },
  {
    tag: "Tiempo real",
    title: "Backend reactivo en Convex",
    body: "Cada lectura se escribe una sola vez y el panel se actualiza solo. El motor de reglas corre dentro de la misma transacción: la alerta existe en el mismo instante que el dato.",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=70",
    alt: "Avenida urbana con tráfico en movimiento entre edificios altos",
  },
  {
    tag: "Operación",
    title: "Del aviso a la orden de taller",
    body: "La alerta llega con qué pasa, si la unidad puede terminar la ruta y qué revisar. El taller recibe una unidad con diagnóstico previo, no una luz encendida.",
    image:
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=900&q=70",
    alt: "Mecánico trabajando bajo el capó de un vehículo en un taller",
  },
];

export function Integrations() {
  return (
    <section
      id="integracion"
      className="scroll-mt-20 bg-[var(--fleet-bg)] py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl leading-[1.05] font-semibold tracking-[-0.025em] text-balance text-[var(--fleet-fg)] md:text-[2.6rem]">
            Se integra con lo que la flota ya tiene.
          </h2>
          <p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-[var(--fleet-muted)]">
            Un dispositivo por unidad en el puerto de diagnóstico, un backend en
            tiempo real y un panel para el jefe de operaciones. Sin parada en
            taller para instalarlo.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.title}
              className="overflow-hidden rounded-lg border border-[var(--fleet-border)] bg-[var(--fleet-surface)]"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 380px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <span className="font-[family-name:var(--font-mono)] inline-block rounded-full border border-[var(--fleet-accent)]/40 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[var(--fleet-accent)] uppercase">
                  {item.tag}
                </span>
                <h3 className="font-[family-name:var(--font-display)] mt-3 text-lg leading-tight font-semibold tracking-[-0.015em] text-[var(--fleet-fg)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--fleet-muted)]">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
