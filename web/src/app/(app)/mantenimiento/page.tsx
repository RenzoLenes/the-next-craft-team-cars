"use client";

import { useQuery } from "convex/react";
import { maintenanceVariant } from "@/components/app/vehicle-widgets";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";

export default function MantenimientoPage() {
  const overview = useQuery(api.telemetry.fleetOverview);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Mantenimiento
        </h1>
        <p className="text-sm text-muted-foreground">
          Cronograma preventivo por kilometraje, comparado contra el odómetro
          actual.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {overview?.map(({ device, latest }) => (
          <VehicleMaintenance
            key={device._id}
            device={device}
            hasReading={latest !== null}
          />
        ))}
      </div>
    </div>
  );
}

function VehicleMaintenance({
  device,
  hasReading,
}: {
  device: Doc<"devices">;
  hasReading: boolean;
}) {
  const items = useQuery(api.maintenance.dueForDevice, {
    deviceId: device._id,
  });

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
      <CardContent className="flex flex-col gap-2">
        {!hasReading && (
          <p className="text-sm text-muted-foreground">Sin lecturas todavía.</p>
        )}
        {hasReading && items?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Sin datos de mantenimiento.
          </p>
        )}
        {items?.map((m) => (
          <div
            key={m.task}
            className="flex items-center justify-between rounded-md border p-3 text-sm"
          >
            <span className="flex items-center gap-2">
              <Badge
                variant={maintenanceVariant[m.status]}
                className="text-[10px]"
              >
                {m.status === "overdue"
                  ? "vencido"
                  : m.status === "due_soon"
                    ? "próximo"
                    : "al día"}
              </Badge>
              {m.label}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {m.status === "ok"
                ? `en ${m.kmRemaining.toLocaleString("es-PE")} km`
                : `${m.kmRemaining} km`}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
