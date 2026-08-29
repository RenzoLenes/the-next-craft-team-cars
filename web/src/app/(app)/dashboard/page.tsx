import { Battery, Car, Gauge, Thermometer, TriangleAlert } from "lucide-react";

import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { alerts, alertTypeLabel, devices, latest } from "@/lib/fleet-data";

const health = [
  { label: "Combustión", score: 87, tone: "ok" as const },
  { label: "Refrigeración", score: 34, tone: "crit" as const },
  { label: "Eléctrico", score: 61, tone: "warn" as const },
  { label: "Admisión", score: 92, tone: "ok" as const },
];

const barTone = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  crit: "bg-[#dc2626]",
};

export default function DashboardPage() {
  const activos = devices.filter((d) => d.status === "active").length;
  const criticas = alerts.filter(
    (a) => a.severity === "critical" && !a.resolved,
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Estado de la flota en tiempo real.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Vehículos activos"
          value={activos}
          hint={`de ${devices.length} registrados`}
          icon={<Car className="size-3.5" />}
        />
        <StatCard
          label="Alertas críticas"
          value={criticas}
          tone={criticas > 0 ? "crit" : "ok"}
          hint="sin resolver"
          icon={<TriangleAlert className="size-3.5" />}
        />
        <StatCard
          label="Temp. máxima"
          value={117}
          unit="°C"
          tone="crit"
          hint="Hilux · Flota 03"
          icon={<Thermometer className="size-3.5" />}
        />
        <StatCard
          label="Batería mínima"
          value={11.8}
          unit="V"
          tone="warn"
          hint="Accent · Flota 01"
          icon={<Battery className="size-3.5" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Gauge className="size-4" />
              Salud por subsistema
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {health.map((h) => (
              <div key={h.label} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between text-xs">
                  <span>{h.label}</span>
                  <span className="font-bold tabular-nums">{h.score}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${barTone[h.tone]}`}
                    style={{ width: `${h.score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Alertas activas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {alerts.map((a) => {
              const device = devices.find((d) => d._id === a.deviceId);
              return (
                <div
                  key={a._id}
                  className="flex items-start gap-3 rounded-md border p-3"
                >
                  <span
                    className={`mt-1 size-2 shrink-0 rounded-full ${
                      a.severity === "critical"
                        ? "bg-[#dc2626]"
                        : "bg-amber-500"
                    }`}
                  />
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold">
                        {alertTypeLabel[a.type]}
                      </span>
                      <Badge
                        variant={
                          a.severity === "critical"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {a.severity === "critical" ? "crítica" : "atención"}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {a.message}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {device?.label ?? a.deviceId}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
