"use client";

import { useCallback, useEffect, useState } from "react";

const SIMULATOR_URL = process.env.NEXT_PUBLIC_SIMULATOR_API_URL ?? "http://localhost:4000";

const FAULT_LABELS: Record<string, string> = {
  none: "Normal",
  overheat: "Sobrecalentamiento",
  battery_undercharge: "Batería descargando",
  battery_overcharge: "Batería sobrecargando",
  check_engine: "Check engine",
};

type SimDevice = {
  deviceId: string;
  vin: string;
  label: string;
  running: boolean;
  fault: string;
  faultProgress: number;
};

type Status = { tickMs: number; devices: SimDevice[] };

export default function SimulatorControlPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${SIMULATOR_URL}/status`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus(await res.json());
      setError(null);
    } catch {
      setError(
        `No se pudo conectar al generador en ${SIMULATOR_URL}. ¿Está corriendo \`npm run dev\` en simulator/generator?`,
      );
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- polling init, not a derived-state calc
    refresh();
    const id = setInterval(refresh, 2000);
    return () => clearInterval(id);
  }, [refresh]);

  async function call(deviceId: string, path: string, body?: unknown) {
    await fetch(`${SIMULATOR_URL}/devices/${deviceId}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    refresh();
  }

  return (
    <main className="flex-1 p-8 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-semibold mb-1">Simulador — Panel de control</h1>
      <p className="text-sm text-gray-500 mb-8">
        Controla el servicio de generación de telemetría ({SIMULATOR_URL}).
      </p>

      {error && (
        <div className="border border-red-300 bg-red-50 text-red-700 text-sm rounded-md px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {status?.devices.map((d) => (
          <div key={d.deviceId} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">{d.label}</p>
                <p className="font-mono text-xs text-gray-500">
                  {d.deviceId} · {d.vin}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  d.running ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {d.running ? "corriendo" : "detenido"}
              </span>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => call(d.deviceId, "/start")}
                disabled={d.running}
                className="text-sm px-3 py-1.5 rounded-md bg-green-600 text-white disabled:opacity-40"
              >
                Start
              </button>
              <button
                onClick={() => call(d.deviceId, "/stop")}
                disabled={!d.running}
                className="text-sm px-3 py-1.5 rounded-md bg-gray-700 text-white disabled:opacity-40"
              >
                Stop
              </button>
            </div>

            <label className="text-xs text-gray-500 block mb-1">
              Inyectar falla (progreso: {(d.faultProgress * 100).toFixed(0)}%)
            </label>
            <select
              value={d.fault}
              onChange={(e) => call(d.deviceId, "/fault", { type: e.target.value })}
              className="text-sm border rounded-md px-2 py-1.5 w-full"
            >
              {Object.entries(FAULT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </main>
  );
}
