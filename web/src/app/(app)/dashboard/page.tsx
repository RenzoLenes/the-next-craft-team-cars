"use client";

import { useQuery } from "convex/react";
import { Battery, Car, Gauge, Thermometer, TriangleAlert } from "lucide-react";
import { StatCard } from "@/components/app/stat-card";
import {
  batteryHealth,
  coolantHealth,
  engineHealth,
  healthBarTone,
  healthTone,
} from "@/components/app/vehicle-widgets";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "../../../../convex/_generated/api";

const alertTypeLabel: Record<string, string> = {
  overheat: "Sobrecalentamiento",
  battery_undercharge: "Batería baja",
  battery_overcharge: "Sobrecarga",
  check_engine: "Check engine",
};

export default function DashboardPage() {
  const overview = useQuery(api.telemetry.fleetOverview);
  const alerts = useQuery(api.alerts.active);

  const readings =
    overview?.map((o) => o.latest).filter((r) => r !== null) ?? [];
  const activos =
    overview?.filter((o) => o.device.status === "active").length ?? 0;
  const criticas = alerts?.filter((a) => a.severity === "critical").length ?? 0;

  const hottest = readings.reduce<{ temp: number; label: string } | null>(
    (acc, r, i) => {
      if (!acc || r.coolantTempC > acc.temp) {
        return {
          temp: r.coolantTempC,
          label: overview?.[i]?.device.label ?? "",
        };
      }
      return acc;
    },
    null,
  );
  const lowestBattery = readings.reduce<{ v: number; label: string } | null>(
    (acc, r, i) => {
      if (!acc || r.batteryVoltage < acc.v) {
        return {
          v: r.batteryVoltage,
          label: overview?.[i]?.device.label ?? "",
        };
      }
      return acc;
    },
    null,
  );

  const coolantScores = readings.map((r) => coolantHealth(r.coolantTempC));
  const batteryScores = readings.map((r) => batteryHealth(r.batteryVoltage));
  const engineScores = readings.map((r) =>
    engineHealth(r.dtcCount, r.milStatus),
  );

  const health = [
    {
      label: "Refrigeración",
      score: coolantScores.length
        ? Math.round(Math.min(...coolantScores))
        : 100,
    },
    {
      label: "Eléctrico",
      score: batteryScores.length
        ? Math.round(Math.min(...batteryScores))
        : 100,
    },
    {
      label: "Motor",
      score: engineScores.length ? Math.round(Math.min(...engineScores)) : 100,
    },
  ].map((h) => ({ ...h, tone: healthTone(h.score) }));

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
          hint={`de ${overview?.length ?? 0} registrados`}
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
          value={hottest ? hottest.temp : "—"}
          unit={hottest ? "°C" : undefined}
          tone={
            hottest && hottest.temp >= 115
              ? "crit"
              : hottest && hottest.temp >= 105
                ? "warn"
                : "ok"
          }
          hint={hottest?.label}
          icon={<Thermometer className="size-3.5" />}
        />
        <StatCard
          label="Batería mínima"
          value={lowestBattery ? lowestBattery.v.toFixed(1) : "—"}
          unit={lowestBattery ? "V" : undefined}
          tone={
            lowestBattery && lowestBattery.v <= 12.2
              ? "crit"
              : lowestBattery && lowestBattery.v <= 13.2
                ? "warn"
                : "ok"
          }
          hint={lowestBattery?.label}
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
                    className={`h-full rounded-full ${healthBarTone[h.tone]}`}
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
            {alerts?.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">
                Sin alertas activas.
              </p>
            )}
            {alerts?.map((a) => {
              const device = overview?.find(
                (o) => o.device._id === a.deviceId,
              )?.device;
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
                        {alertTypeLabel[a.type] ?? a.type}
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
