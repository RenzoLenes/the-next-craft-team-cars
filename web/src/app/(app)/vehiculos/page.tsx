"use client";

import { useQuery } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "../../../../convex/_generated/api";

export default function VehiculosPage() {
  const overview = useQuery(api.telemetry.fleetOverview);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Vehículos
        </h1>
        <p className="text-sm text-muted-foreground">
          Dispositivos OBD-II registrados y su última lectura.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead className="text-right">Odómetro</TableHead>
                  <TableHead className="text-right">Refrig.</TableHead>
                  <TableHead className="text-right">Batería</TableHead>
                  <TableHead className="text-right">DTC</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview === undefined && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-sm text-muted-foreground"
                    >
                      Cargando…
                    </TableCell>
                  </TableRow>
                )}
                {overview?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-sm text-muted-foreground"
                    >
                      Sin vehículos registrados — arrancá el simulador.
                    </TableCell>
                  </TableRow>
                )}
                {overview?.map(({ device, latest: t }) => (
                  <TableRow key={device._id}>
                    <TableCell className="font-bold">
                      {device.label ?? device.deviceId}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {device.deviceId}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {t
                        ? `${Math.round(t.odometerKm ?? 0).toLocaleString("es-PE")} km`
                        : "—"}
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums ${
                        t && t.coolantTempC >= 115
                          ? "font-bold text-[#dc2626]"
                          : ""
                      }`}
                    >
                      {t ? `${t.coolantTempC}°C` : "—"}
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums ${
                        t && t.batteryVoltage <= 12.2
                          ? "font-bold text-[#dc2626]"
                          : ""
                      }`}
                    >
                      {t ? `${t.batteryVoltage.toFixed(1)} V` : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {t && t.troubleCodes.length > 0
                        ? t.troubleCodes.join(", ")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          device.status === "active" ? "secondary" : "outline"
                        }
                        className="text-[10px]"
                      >
                        {device.status === "active" ? "activo" : "inactivo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
