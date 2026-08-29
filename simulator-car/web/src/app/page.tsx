"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import VehicleScene from "@/components/VehicleScene";

const severityColor: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border-red-300",
  warning: "bg-amber-100 text-amber-800 border-amber-300",
};

const maintenanceStatusColor: Record<string, string> = {
  overdue: "bg-red-100 text-red-800",
  due_soon: "bg-amber-100 text-amber-800",
  ok: "bg-gray-100 text-gray-500",
};

export default function Home() {
  const overview = useQuery(api.telemetry.fleetOverview);
  const alerts = useQuery(api.alerts.active);

  return (
    <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-semibold mb-1">FleetCare — Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">
        Telemetría en vivo vía Convex. Si no ves datos, arranca el simulador.
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-medium mb-3">Alertas activas</h2>
        {alerts === undefined && <p className="text-sm text-gray-400">Cargando…</p>}
        {alerts?.length === 0 && (
          <p className="text-sm text-gray-400">Sin alertas activas.</p>
        )}
        <ul className="space-y-2">
          {alerts?.map((a) => (
            <li
              key={a._id}
              className={`border rounded-md px-4 py-2 text-sm ${severityColor[a.severity]}`}
            >
              <span className="font-mono text-xs mr-2 uppercase">{a.severity}</span>
              {a.message}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Flota</h2>
        {overview === undefined && <p className="text-sm text-gray-400">Cargando…</p>}
        {overview?.length === 0 && (
          <p className="text-sm text-gray-400">
            Sin vehículos aún — el simulador los crea al enviar la primera lectura.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {overview?.map(({ device, latest }) => (
            <VehicleCard key={device._id} device={device} latest={latest} />
          ))}
        </div>
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
  const maintenance = useQuery(api.maintenance.dueForDevice, { deviceId: device._id });

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <span className="text-sm font-medium">{device.label ?? device.deviceId}</span>
          <span className="block font-mono text-xs text-gray-400">{device.deviceId}</span>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            device.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {device.status}
        </span>
      </div>
      {latest ? (
        <>
          <VehicleScene
            className="h-48 w-full rounded-md overflow-hidden bg-neutral-900 mb-3"
            coolantTempC={latest.coolantTempC}
            batteryVoltage={latest.batteryVoltage}
            engineRpm={latest.engineRpm}
            faultActive={latest.milStatus || latest.dtcCount > 0}
          />
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-4">
            <dt className="text-gray-500">RPM</dt>
            <dd>{latest.engineRpm}</dd>
            <dt className="text-gray-500">Velocidad</dt>
            <dd>{latest.vehicleSpeedKmh} km/h</dd>
            <dt className="text-gray-500">Refrigerante</dt>
            <dd>{latest.coolantTempC}°C</dd>
            <dt className="text-gray-500">Batería</dt>
            <dd>{latest.batteryVoltage} V</dd>
            <dt className="text-gray-500">Combustible</dt>
            <dd>{latest.fuelLevelPct}%</dd>
            <dt className="text-gray-500">Odómetro</dt>
            <dd>{(latest.odometerKm ?? 0).toFixed(0)} km</dd>
          </dl>

          <h3 className="text-xs font-medium text-gray-500 mb-2">Mantenimiento preventivo</h3>
          <ul className="space-y-1">
            {maintenance
              ?.filter((m) => m.status !== "ok")
              .map((m) => (
                <li
                  key={m.task}
                  className={`text-xs rounded px-2 py-1 flex justify-between ${maintenanceStatusColor[m.status]}`}
                >
                  <span>{m.label}</span>
                  <span className="font-mono">{m.kmRemaining} km</span>
                </li>
              ))}
            {maintenance?.every((m) => m.status === "ok") && (
              <li className="text-xs text-gray-400">Todo al día.</li>
            )}
          </ul>
        </>
      ) : (
        <p className="text-sm text-gray-400">Sin lecturas todavía.</p>
      )}
    </div>
  );
}
