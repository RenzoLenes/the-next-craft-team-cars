"use client";

import { useQuery } from "convex/react";
import {
  batteryHealth,
  coolantHealth,
  engineHealth,
  healthBarTone,
  healthTone,
} from "@/components/app/vehicle-widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";

export default function SaludPage() {
  const overview = useQuery(api.telemetry.fleetOverview);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Salud predictiva
        </h1>
        <p className="text-sm text-muted-foreground">
          Score por subsistema derivado de la desviación respecto al rango
          normal — no es un diagnóstico de sensores dedicados, solo lo que el
          OBD-II genérico reporta.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {overview?.map(({ device, latest }) => (
          <VehicleHealth key={device._id} device={device} latest={latest} />
        ))}
      </div>
    </div>
  );
}

function VehicleHealth({
  device,
  latest,
}: {
  device: Doc<"devices">;
  latest: Doc<"telemetryReadings"> | null;
}) {
  const items = latest
    ? [
        {
          label: "Refrigeración",
          score: Math.round(coolantHealth(latest.coolantTempC)),
        },
        {
          label: "Eléctrico",
          score: Math.round(batteryHealth(latest.batteryVoltage)),
        },
        {
          label: "Motor",
          score: Math.round(engineHealth(latest.dtcCount, latest.milStatus)),
        },
      ].map((h) => ({ ...h, tone: healthTone(h.score) }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {device.label ?? device.deviceId}
        </CardTitle>
        <p className="font-mono text-xs text-muted-foreground">
          {device.deviceId}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!latest && (
          <p className="text-sm text-muted-foreground">Sin lecturas todavía.</p>
        )}
        {items.map((h) => (
          <div key={h.label} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between text-xs">
              <span>{h.label}</span>
              <span className="font-bold tabular-nums">{h.score}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${healthBarTone[h.tone]}`}
                style={{ width: `${h.score}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
