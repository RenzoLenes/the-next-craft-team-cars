"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SIMULATOR_URL = process.env.NEXT_PUBLIC_SIMULATOR_API_URL ?? "";

type FaultKey =
  | "none"
  | "overheat"
  | "battery_undercharge"
  | "battery_overcharge"
  | "check_engine";
type DriveMode = "city" | "highway";

const FAULTS: { value: FaultKey; label: string }[] = [
  { value: "none", label: "Normal" },
  { value: "overheat", label: "Sobrecalentamiento" },
  { value: "battery_undercharge", label: "Batería descargando" },
  { value: "battery_overcharge", label: "Batería sobrecargando" },
  { value: "check_engine", label: "Check engine" },
];

const MODES: { value: DriveMode; label: string }[] = [
  { value: "city", label: "Ciudad" },
  { value: "highway", label: "Carretera" },
];

type SimDevice = {
  deviceId: string;
  vin: string;
  label: string;
  running: boolean;
  mode: DriveMode;
  speedKmh: number;
  fault: FaultKey;
  faultProgress: number;
};

type Status = { tickMs: number; devices: SimDevice[] };

export default function SimuladorPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!SIMULATOR_URL) return;
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- polling init, not derived state
    refresh();
    const id = setInterval(refresh, 2000);
    return () => clearInterval(id);
  }, [refresh]);

  async function call(
    deviceId: string,
    action: string,
    path: string,
    body?: unknown,
  ) {
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
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            Simulador
          </h1>
          <p className="text-sm text-muted-foreground">
            Generador de telemetría (ECS Fargate) — controlalo directo desde
            acá.
          </p>
        </div>
        <Badge variant={connected ? "default" : "outline"}>
          {connected === null
            ? "conectando…"
            : connected
              ? "en línea"
              : "sin conexión"}
        </Badge>
      </div>

      {!SIMULATOR_URL && (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Falta la variable de entorno{" "}
            <code className="font-mono">NEXT_PUBLIC_SIMULATOR_API_URL</code>.
          </CardContent>
        </Card>
      )}

      {SIMULATOR_URL && connected === false && (
        <Card className="border-amber-500/40">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No hay conexión con{" "}
            <code className="font-mono text-xs">{SIMULATOR_URL}</code>. Puede
            estar apagado a propósito para no gastar cuota de Convex fuera de
            las demos.
          </CardContent>
        </Card>
      )}

      {connected && status && (
        <div className="grid gap-4 sm:grid-cols-2">
          {status.devices.map((d) => (
            <VehicleControl
              key={d.deviceId}
              device={d}
              pending={pending}
              onCall={(action, path, body) =>
                call(d.deviceId, action, path, body)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VehicleControl({
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
  const isPending = (action: string) =>
    pending === `${device.deviceId}:${action}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-sm">{device.label}</CardTitle>
          <p className="font-mono text-xs text-muted-foreground">
            {device.deviceId}
          </p>
        </div>
        <Badge variant={device.running ? "default" : "outline"}>
          {device.running ? `corriendo · ${device.speedKmh} km/h` : "detenido"}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            disabled={device.running || isPending("start")}
            onClick={() => onCall("start", "/start")}
          >
            {isPending("start") ? "…" : "▶ Start"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            disabled={!device.running || isPending("stop")}
            onClick={() => onCall("stop", "/stop")}
          >
            {isPending("stop") ? "…" : "■ Stop"}
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`mode-${device.deviceId}`}
            className="text-xs text-muted-foreground"
          >
            Modo de manejo
          </label>
          <select
            id={`mode-${device.deviceId}`}
            value={device.mode}
            onChange={(e) => onCall("mode", "/mode", { mode: e.target.value })}
            className="rounded-md border bg-background px-2.5 py-1.5 text-sm"
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={`fault-${device.deviceId}`}
              className="text-xs text-muted-foreground"
            >
              Falla inyectada
            </label>
            {faultActive && (
              <span className="font-mono text-xs text-amber-600">
                {progressPct}%
              </span>
            )}
          </div>
          {faultActive && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#dc2626] transition-[width]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          )}
          <select
            id={`fault-${device.deviceId}`}
            value={device.fault}
            onChange={(e) =>
              onCall("fault", "/fault", { type: e.target.value })
            }
            className="rounded-md border bg-background px-2.5 py-1.5 text-sm"
          >
            {FAULTS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
