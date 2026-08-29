"use client";

import { useQuery } from "convex/react";
import { CartesianGrid, Line, LineChart, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

const maintenanceVariant: Record<
  string,
  "destructive" | "secondary" | "outline"
> = {
  overdue: "destructive",
  due_soon: "secondary",
  ok: "outline",
};

function formatEta(hours: number | null): string | null {
  if (hours === null) return null;
  if (hours < 1) return `~${Math.round(hours * 60)} min`;
  if (hours < 48) return `~${hours.toFixed(1)} h`;
  return `~${Math.round(hours / 24)} días`;
}

export default function FleetPage() {
  const overview = useQuery(api.telemetry.fleetOverview);
  const alerts = useQuery(api.alerts.active);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flota</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Telemetría en vivo, tendencia y mantenimiento preventivo por vehículo.
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Alertas activas
        </h2>
        {alerts?.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin alertas activas.</p>
        )}
        <div className="flex flex-col gap-1.5">
          {alerts?.map((a) => (
            <div
              key={a._id}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
            >
              <Badge
                variant={
                  a.severity === "critical" ? "destructive" : "secondary"
                }
              >
                {a.severity}
              </Badge>
              <span>{a.message}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {overview?.map(({ device, latest }) => (
          <VehicleCard key={device._id} device={device} latest={latest} />
        ))}
      </section>
    </main>
  );
}

function VehicleCard({
  device,
  latest,
}: {
  device: Doc<"devices">;
  latest: Doc<"telemetryReadings"> | null;
}) {
  const history = useQuery(api.telemetry.historyByDevice, {
    deviceId: device._id,
    limit: 20,
  });
  const forecast = useQuery(api.trends.forecastForDevice, {
    deviceId: device._id,
  });
  const maintenance = useQuery(api.maintenance.dueForDevice, {
    deviceId: device._id,
  });

  const chartData = history
    ? history
        .slice()
        .reverse()
        .map((r) => ({
          t: r.timestamp,
          coolantTempC: r.coolantTempC,
          batteryVoltage: r.batteryVoltage,
        }))
    : [];

  const coolantConfig: ChartConfig = {
    coolantTempC: { label: "Refrigerante (°C)", color: "var(--chart-1)" },
  };
  const batteryConfig: ChartConfig = {
    batteryVoltage: { label: "Batería (V)", color: "var(--chart-3)" },
  };

  const dueItems = maintenance?.filter((m) => m.status !== "ok") ?? [];
  const coolantEta = formatEta(forecast?.coolant?.etaHours ?? null);
  const batteryEta = formatEta(forecast?.battery?.etaHours ?? null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{device.label ?? device.deviceId}</CardTitle>
            <p className="font-mono text-xs text-muted-foreground">
              {device.deviceId}
            </p>
          </div>
          <Badge variant={device.status === "active" ? "default" : "outline"}>
            {device.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {!latest && (
          <p className="text-sm text-muted-foreground">Sin lecturas todavía.</p>
        )}

        {latest && (
          <>
            <dl className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
              <Stat label="RPM" value={String(latest.engineRpm)} />
              <Stat
                label="Velocidad"
                value={`${latest.vehicleSpeedKmh} km/h`}
              />
              <Stat
                label="Odómetro"
                value={`${(latest.odometerKm ?? 0).toFixed(0)} km`}
              />
              <Stat label="Refrigerante" value={`${latest.coolantTempC}°C`} />
              <Stat label="Batería" value={`${latest.batteryVoltage} V`} />
              <Stat label="Combustible" value={`${latest.fuelLevelPct}%`} />
            </dl>

            {chartData.length >= 5 && (
              <div className="grid grid-cols-2 gap-3">
                <TrendChart
                  title="Refrigerante"
                  config={coolantConfig}
                  dataKey="coolantTempC"
                  data={chartData}
                  eta={coolantEta}
                />
                <TrendChart
                  title="Batería"
                  config={batteryConfig}
                  dataKey="batteryVoltage"
                  data={chartData}
                  eta={batteryEta}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Mantenimiento
              </h3>
              {dueItems.length === 0 && (
                <p className="text-xs text-muted-foreground">Todo al día.</p>
              )}
              {dueItems.map((m) => (
                <div
                  key={m.task}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-1.5">
                    <Badge variant={maintenanceVariant[m.status]}>
                      {m.status}
                    </Badge>
                    {m.label}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {m.kmRemaining} km
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm">{value}</dd>
    </div>
  );
}

function TrendChart({
  title,
  config,
  dataKey,
  data,
  eta,
}: {
  title: string;
  config: ChartConfig;
  dataKey: "coolantTempC" | "batteryVoltage";
  data: { t: number; coolantTempC: number; batteryVoltage: number }[];
  eta: string | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{title}</span>
        {eta && (
          <span className="text-xs font-medium text-foreground">⚠ {eta}</span>
        )}
      </div>
      <ChartContainer config={config} className="aspect-auto h-[72px] w-full">
        <LineChart
          data={data}
          margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
          <ChartTooltip
            content={<ChartTooltipContent labelKey="t" hideLabel />}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={`var(--color-${dataKey})`}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
