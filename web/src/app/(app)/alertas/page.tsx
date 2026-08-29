"use client";

import { useQuery } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "../../../../convex/_generated/api";

const alertTypeLabel: Record<string, string> = {
  overheat: "Sobrecalentamiento",
  battery_undercharge: "Batería baja",
  battery_overcharge: "Sobrecarga",
  check_engine: "Check engine",
};

export default function AlertasPage() {
  const alerts = useQuery(api.alerts.active);
  const devices = useQuery(api.devices.list);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Alertas
        </h1>
        <p className="text-sm text-muted-foreground">
          Disparadas por el motor de reglas sobre cada lectura de telemetría.
        </p>
      </div>

      {alerts?.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Sin alertas activas.
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {alerts?.map((a) => {
          const device = devices?.find((d) => d._id === a.deviceId);
          const critical = a.severity === "critical";
          return (
            <Card
              key={a._id}
              className={
                critical ? "border-[#dc2626]/50" : "border-amber-500/40"
              }
            >
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${critical ? "bg-[#dc2626]" : "bg-amber-500"}`}
                  />
                  <span className="font-[family-name:var(--font-display)] text-sm font-bold">
                    {alertTypeLabel[a.type] ?? a.type}
                  </span>
                  <Badge
                    variant={critical ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {critical ? "crítica" : "atención"}
                  </Badge>
                  <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">
                    {new Date(a.timestamp).toLocaleTimeString("es-PE")}
                  </span>
                </div>
                <p className="text-sm">{a.message}</p>
                <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground">
                  <span>{device?.label ?? a.deviceId}</span>
                  <span className="tabular-nums">
                    valor {a.value} · umbral {a.threshold}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
