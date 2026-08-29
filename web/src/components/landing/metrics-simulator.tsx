"use client";

import dynamic from "next/dynamic";
import { useEffect, useEffectEvent, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  type CarMetrics,
  INITIAL_METRICS,
  deriveSignal,
  signalLabel,
} from "./simulator/metrics";

const SimulatorScene = dynamic(
  () =>
    import("./simulator/simulator-scene").then((mod) => mod.SimulatorScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] items-center justify-center bg-[var(--fleet-panel)] font-[family-name:var(--font-mono)] text-sm text-[var(--fleet-muted)]">
        Cargando simulador 3D…
      </div>
    ),
  }
);

export function MetricsSimulator() {
  const [metrics, setMetrics] = useState<CarMetrics>(INITIAL_METRICS);
  const [playing, setPlaying] = useState(true);
  const [forceAlert, setForceAlert] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = document.getElementById("simulador");
    if (!node) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const tick = useEffectEvent(() => {
    setMetrics((current) => {
      if (forceAlert) {
        return {
          ...current,
          speed: 128,
          rpm: 4200,
          temperature: 108,
          battery: Math.max(20, current.battery - 0.4),
          signal: "limite",
        };
      }

      const wobble = (Math.random() - 0.5) * 8;
      const speed = Math.max(35, Math.min(135, current.speed + wobble));
      const rpm = Math.round(1400 + speed * 22 + (Math.random() - 0.5) * 120);
      const temperature = Math.max(
        75,
        Math.min(112, current.temperature + (Math.random() - 0.45) * 2.2)
      );
      const battery = Math.max(
        18,
        Math.min(100, current.battery - speed * 0.002)
      );
      return {
        speed: Math.round(speed),
        rpm,
        temperature: Math.round(temperature),
        battery: Math.round(battery * 10) / 10,
        signal: deriveSignal(speed, temperature),
      };
    });
  });

  useEffect(() => {
    if (!playing || reducedMotion || !visible) return;
    const id = window.setInterval(() => tick(), 900);
    return () => window.clearInterval(id);
  }, [playing, reducedMotion, visible]);

  return (
    <section
      id="simulador"
      className="scroll-mt-20 border-t border-[var(--fleet-border)] bg-[var(--fleet-bg)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wide text-[var(--fleet-fg)] uppercase md:text-3xl">
          Simulador de métricas
        </h2>
        <p className="mt-3 max-w-2xl font-[family-name:var(--font-mono)] text-sm text-[var(--fleet-muted)] md:text-base">
          Telemetría simulada sobre un auto 3D. Las luces y la señal reaccionan
          cuando velocidad o temperatura cruzan umbrales.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="relative h-[420px] overflow-hidden border border-[var(--fleet-border)] bg-[var(--fleet-panel)] md:h-[520px]">
            {visible ? (
              <SimulatorScene
                metrics={metrics}
                reducedMotion={reducedMotion || !playing}
              />
            ) : (
              <div className="flex h-full items-center justify-center font-[family-name:var(--font-mono)] text-sm text-[var(--fleet-muted)]">
                Desplázate para cargar el simulador…
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 border border-[var(--fleet-border)] bg-white p-5">
            <p className="font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.2em] text-[var(--fleet-muted)] uppercase">
              HUD en vivo
            </p>
            <MetricRow label="Velocidad" value={`${metrics.speed} km/h`} />
            <MetricRow label="RPM" value={`${metrics.rpm}`} />
            <MetricRow label="Temperatura" value={`${metrics.temperature} °C`} />
            <MetricRow label="Batería" value={`${metrics.battery}%`} />
            <div className="flex min-h-11 items-center justify-between gap-3 border-t border-[var(--fleet-border)] pt-4">
              <span className="font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--fleet-muted)] uppercase">
                Señal
              </span>
              <span className={cnSignal(metrics.signal)}>
                {signalLabel(metrics.signal)}
              </span>
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <button
                type="button"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "min-h-11 cursor-pointer px-4"
                )}
                onClick={() => setPlaying((value) => !value)}
              >
                {playing ? "Pausar" : "Reanudar"}
              </button>
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "min-h-11 cursor-pointer border-[var(--fleet-border)] px-4",
                  forceAlert && "border-[var(--fleet-accent)] text-[var(--fleet-accent)]"
                )}
                onClick={() => setForceAlert((value) => !value)}
              >
                {forceAlert ? "Quitar alerta" : "Forzar alerta"}
              </button>
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "min-h-11 cursor-pointer px-4 text-[var(--fleet-muted)]"
                )}
                onClick={() => {
                  setForceAlert(false);
                  setMetrics(INITIAL_METRICS);
                  setPlaying(true);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--fleet-muted)] uppercase">
        {label}
      </span>
      <span className="font-[family-name:var(--font-mono)] text-lg tabular-nums text-[var(--fleet-fg)]">
        {value}
      </span>
    </div>
  );
}

function cnSignal(signal: CarMetrics["signal"]) {
  const base =
    "inline-flex min-h-11 items-center rounded-md px-3 font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase";
  if (signal === "alerta") return `${base} bg-amber-100 text-amber-900`;
  if (signal === "limite") {
    return `${base} bg-red-100 text-red-800 motion-safe:animate-pulse`;
  }
  return `${base} bg-emerald-100 text-emerald-900`;
}
