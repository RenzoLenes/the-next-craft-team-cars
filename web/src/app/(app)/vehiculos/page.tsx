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
import { devices, latest } from "@/lib/fleet-data";

export default function VehiculosPage() {
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
                {devices.map((d) => {
                  const t = latest[d._id];
                  return (
                    <TableRow key={d._id}>
                      <TableCell className="font-bold">{d.label}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {d.deviceId}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {t.odometerKm.toLocaleString("es-PE")} km
                      </TableCell>
                      <TableCell
                        className={`text-right tabular-nums ${
                          t.coolantTempC >= 115
                            ? "font-bold text-[#dc2626]"
                            : ""
                        }`}
                      >
                        {t.coolantTempC}°C
                      </TableCell>
                      <TableCell
                        className={`text-right tabular-nums ${
                          t.batteryVoltage <= 12.2
                            ? "font-bold text-[#dc2626]"
                            : ""
                        }`}
                      >
                        {t.batteryVoltage.toFixed(1)} V
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {t.troubleCodes.length > 0
                          ? t.troubleCodes.join(", ")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            d.status === "active" ? "secondary" : "outline"
                          }
                          className="text-[10px]"
                        >
                          {d.status === "active" ? "activo" : "inactivo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
