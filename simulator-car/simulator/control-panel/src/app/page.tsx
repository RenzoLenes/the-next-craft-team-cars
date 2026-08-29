"use client";

import { useCallback, useEffect, useState } from "react";

const SIMULATOR_URL = process.env.NEXT_PUBLIC_SIMULATOR_API_URL ?? "http://localhost:4000";

type FaultKey = "none" | "overheat" | "battery_undercharge" | "battery_overcharge" | "check_engine";

const FAULTS: { value: FaultKey; label: string }[] = [
  { value: "none", label: "Normal" },
  { value: "overheat", label: "Sobrecalentamiento" },
  { value: "battery_undercharge", label: "Batería descargando" },
  { value: "battery_overcharge", label: "Batería sobrecargando" },
  { value: "check_engine", label: "Check engine" },
];

type SimDevice = {
  deviceId: string;
  vin: string;
  label: string;
  running: boolean;
  fault: FaultKey;
  faultProgress: number;
};

type Status = { tickMs: number; devices: SimDevice[] };

export default function SimulatorControlPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${SIMULATOR_URL}/status`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus(await res.json());
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- polling init, not a derived-state calc
    refresh();
    const id = setInterval(refresh, 2000);
    return () => clearInterval(id);
  }, [refresh]);

  async function call(deviceId: string, action: string, path: string, body?: unknown) {
    setPending(`${deviceId}:${action}`);
    try {
      await fetch(`${SIMULATOR_URL}/devices/${deviceId}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      await refresh();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="min-h-full bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              Panel de control — Simulador
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              Arrancá vehículos e inyectá fallas para probar la detección en vivo.
            </p>
          </div>
          <ConnectionBadge connected={connected} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {connected === false && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-medium">No hay conexión con el generador.</p>
            <p className="mt-1 text-amber-800">
              Puede estar apagado a propósito (para no gastar cuota de Convex fuera de las
              demos) — pedile a quien administra la infra que lo prenda. Endpoint:{" "}
              <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">
                {SIMULATOR_URL}
              </code>
            </p>
          </div>
        )}

        {connected && status && (
          <div className="grid gap-4 sm:grid-cols-2">
            {status.devices.map((d) => (
              <VehicleCard
                key={d.deviceId}
                device={d}
                pending={pending}
                onCall={(action, path, body) => call(d.deviceId, action, path, body)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ConnectionBadge({ connected }: { connected: boolean | null }) {
  const color =
    connected === null ? "bg-neutral-300" : connected ? "bg-emerald-500" : "bg-red-500";
  const text = connected === null ? "Conectando…" : connected ? "En línea" : "Sin conexión";
  const textColor =
    connected === null ? "text-neutral-500" : connected ? "text-emerald-700" : "text-red-700";
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className={`h-2 w-2 rounded-full ${color} ${connected ? "animate-pulse" : ""}`} />
      <span className={`text-xs font-medium ${textColor}`}>{text}</span>
    </div>
  );
}

function VehicleCard({
  device,
  pending,
  onCall,
}: {
  device: SimDevice;
  pending: string | null;
  onCall: (action: string, path: string, body?: unknown) => void;
}) {
  const faultActive = device.fault !== "none";
  const progressPct = Math.round(device.faultProgress * 100);
  const isPending = (action: string) => pending === `${device.deviceId}:${action}`;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-base font-semibold text-neutral-900">{device.label}</p>
          <p className="font-mono text-xs text-neutral-400 mt-0.5">
            {device.deviceId} · {device.vin}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
            device.running
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${device.running ? "bg-emerald-500" : "bg-neutral-400"}`} />
          {device.running ? "Corriendo" : "Detenido"}
        </span>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => onCall("start", "/start")}
          disabled={device.running || isPending("start")}
          className="flex-1 text-sm font-medium px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-35 disabled:hover:bg-emerald-600"
        >
          {isPending("start") ? "…" : "▶ Start"}
        </button>
        <button
          onClick={() => onCall("stop", "/stop")}
          disabled={!device.running || isPending("stop")}
          className="flex-1 text-sm font-medium px-3 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-900 transition-colors disabled:opacity-35 disabled:hover:bg-neutral-800"
        >
          {isPending("stop") ? "…" : "■ Stop"}
        </button>
      </div>

      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={`fault-${device.deviceId}`} className="text-xs font-medium text-neutral-500">
          Falla inyectada
        </label>
        {faultActive && (
          <span className="font-mono text-xs text-amber-700">{progressPct}%</span>
        )}
      </div>

      {faultActive && (
        <div className="h-1.5 w-full rounded-full bg-neutral-100 mb-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-500 transition-[width]"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      <select
        id={`fault-${device.deviceId}`}
        value={device.fault}
        onChange={(e) => onCall("fault", "/fault", { type: e.target.value })}
        className={`text-sm border rounded-lg px-3 py-2 w-full bg-white ${
          faultActive
            ? "border-amber-300 text-amber-900 font-medium"
            : "border-neutral-200 text-neutral-700"
        }`}
      >
        {FAULTS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
