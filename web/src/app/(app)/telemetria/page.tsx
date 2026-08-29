"use client";

import { useQuery } from "convex/react";
import {
  ArcGauge,
  formatEta,
  TrendChart,
} from "@/components/app/vehicle-widgets";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";

export default function TelemetriaPage() {
  const overview = useQuery(api.telemetry.fleetOverview);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Telemetría
        </h1>
        <p className="text-sm text-muted-foreground">
          Lecturas en vivo y tendencia de los últimos minutos por vehículo.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {overview?.map(({ device, latest }) => (
          <VehicleTelemetry key={device._id} device={device} latest={latest} />
        ))}
      </div>
    </div>
  );
}

function VehicleTelemetry({
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

  const chartData =
    history
      ?.slice()
      .reverse()
      .map((r) => ({
        t: r.timestamp,
        coolantTempC: r.coolantTempC,
        batteryVoltage: r.batteryVoltage,
      })) ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-sm">
            {device.label ?? device.deviceId}
          </CardTitle>
          <p className="font-mono text-xs text-muted-foreground">
            {device.deviceId}
          </p>
        </div>
        <Badge variant={device.status === "active" ? "default" : "outline"}>
          {device.status}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {!latest && (
          <p className="text-sm text-muted-foreground">Sin lecturas todavía.</p>
        )}
        {latest && (
          <>
            <div className="grid grid-cols-3 gap-1">
              <ArcGauge
                label="Velocidad"
                displayValue={`${latest.vehicleSpeedKmh} km/h`}
                value={latest.vehicleSpeedKmh}
                min={0}
                max={180}
              />
              <ArcGauge
                label="Combustible"
                displayValue={`${latest.fuelLevelPct.toFixed(0)}%`}
                value={latest.fuelLevelPct}
                min={0}
                max={100}
                critical={latest.fuelLevelPct < 15}
              />
              <ArcGauge
                label="Batería"
                displayValue={`${latest.batteryVoltage.toFixed(1)} V`}
                value={latest.batteryVoltage}
                min={11}
                max={16}
                critical={
                  latest.batteryVoltage < 12.2 || latest.batteryVoltage > 15
                }
              />
            </div>

            {chartData.length >= 5 && (
              <div className="grid grid-cols-2 gap-3">
                <TrendChart
                  title="Refrigerante (°C)"
                  dataKey="coolantTempC"
                  color="var(--chart-1)"
                  data={chartData}
                  eta={formatEta(forecast?.coolant?.etaHours ?? null)}
                />
                <TrendChart
                  title="Batería (V)"
                  dataKey="batteryVoltage"
                  color="var(--chart-3)"
                  data={chartData}
                  eta={formatEta(forecast?.battery?.etaHours ?? null)}
                />
              </div>
            )}

            <dl className="grid grid-cols-3 gap-x-3 gap-y-2 text-xs">
              <div>
                <dt className="text-muted-foreground">RPM</dt>
                <dd className="font-mono">{latest.engineRpm}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Odómetro</dt>
                <dd className="font-mono">
                  {Math.round(latest.odometerKm ?? 0)} km
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">DTC</dt>
                <dd className="font-mono">{latest.dtcCount}</dd>
              </div>
            </dl>
          </>
        )}
      </CardContent>
    </Card>
  );
}
