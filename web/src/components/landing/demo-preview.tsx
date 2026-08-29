"use client";

import { useEffect, useEffectEvent, useState } from "react";

type MetricRow = {
  id: string;
  vehicle: string;
  speed: number;
  battery: number;
  signal: "ok" | "alerta" | "limite";
};

const seed: MetricRow[] = [
  { id: "u-01", vehicle: "Unidad 01", speed: 94, battery: 72, signal: "ok" },
  { id: "u-02", vehicle: "Unidad 02", speed: 118, battery: 41, signal: "alerta" },
  { id: "u-03", vehicle: "Unidad 03", speed: 67, battery: 88, signal: "ok" },
  { id: "u-04", vehicle: "Unidad 04", speed: 132, battery: 29, signal: "limite" },
];

const signalLabel = {
  ok: "OK",
  alerta: "ALERTA",
  limite: "LÍMITE",
} as const;

export function DemoPreview() {
  const [rows, setRows] = useState(seed);
  const [tick, setTick] = useState(0);

  const pulse = useEffectEvent(() => {
    setRows((current) =>
      current.map((row, index) => {
        const wobble = ((tick + index) % 5) - 2;
        const nextSpeed = Math.max(40, Math.min(140, row.speed + wobble));
        let signal: MetricRow["signal"] = "ok";
        if (nextSpeed >= 125) signal = "limite";
        else if (nextSpeed >= 110) signal = "alerta";
        return { ...row, speed: nextSpeed, signal };
      })
    );
    setTick((value) => value + 1);
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const id = window.setInterval(() => {
      pulse();
    }, 1800);

    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="demo"
      className="scroll-mt-20 border-t border-[var(--signal-border)] bg-[var(--signal-panel)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wide text-[var(--signal-fg)] uppercase md:text-3xl">
          Demo de consola
        </h2>
        <p className="mt-3 max-w-xl font-[family-name:var(--font-mono)] text-sm text-[var(--signal-muted)] md:text-base">
          Vista previa estática con telemetría simulada. Las señales cambian
          cuando la velocidad cruza umbrales.
        </p>

        <div className="mt-10 overflow-x-auto rounded-lg border border-[var(--signal-border)] bg-white">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <caption className="sr-only">
              Métricas simuladas de vehículos y señales de control
            </caption>
            <thead>
              <tr className="border-b border-[var(--signal-border)] bg-[var(--signal-bg)]">
                <th className="px-4 py-3 font-[family-name:var(--font-mono)] text-xs font-normal tracking-wider text-[var(--signal-muted)] uppercase">
                  Vehículo
                </th>
                <th className="px-4 py-3 font-[family-name:var(--font-mono)] text-xs font-normal tracking-wider text-[var(--signal-muted)] uppercase">
                  Velocidad
                </th>
                <th className="px-4 py-3 font-[family-name:var(--font-mono)] text-xs font-normal tracking-wider text-[var(--signal-muted)] uppercase">
                  Batería
                </th>
                <th className="px-4 py-3 font-[family-name:var(--font-mono)] text-xs font-normal tracking-wider text-[var(--signal-muted)] uppercase">
                  Señal
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[var(--signal-border)] last:border-b-0"
                >
                  <td className="px-4 py-4 font-[family-name:var(--font-mono)] text-sm text-[var(--signal-fg)]">
                    {row.vehicle}
                  </td>
                  <td className="px-4 py-4 font-[family-name:var(--font-mono)] text-sm tabular-nums text-[var(--signal-fg)]">
                    {row.speed} km/h
                  </td>
                  <td className="px-4 py-4 font-[family-name:var(--font-mono)] text-sm tabular-nums text-[var(--signal-fg)]">
                    {row.battery}%
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cnSignal(row.signal)}
                      aria-label={`Señal ${signalLabel[row.signal]}`}
                    >
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-current"
                      />
                      {signalLabel[row.signal]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function cnSignal(signal: MetricRow["signal"]) {
  const base =
    "inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase";

  if (signal === "alerta") {
    return `${base} bg-amber-100 text-amber-900`;
  }
  if (signal === "limite") {
    return `${base} bg-red-100 text-red-800 motion-safe:animate-pulse`;
  }
  return `${base} bg-emerald-100 text-emerald-900`;
}
