import { v } from "convex/values";
import { query } from "./_generated/server";

// Intervalos estándar de industria para sedán/pickup a gasolina (no específicos de un
// manual Toyota real — ver README para el trade-off de tiempo del hackathon).
const BASE_SCHEDULE = [
  { task: "oil_change", label: "Cambio de aceite y filtro", intervalKm: 10_000 },
  { task: "tire_rotation", label: "Rotación de neumáticos", intervalKm: 10_000 },
  { task: "air_filter", label: "Filtro de aire", intervalKm: 20_000 },
  { task: "brake_inspection", label: "Inspección de pastillas de freno", intervalKm: 20_000 },
  { task: "spark_plugs", label: "Bujías", intervalKm: 40_000 },
  { task: "brake_fluid", label: "Líquido de frenos", intervalKm: 40_000 },
  { task: "coolant_flush", label: "Refrigerante (flush)", intervalKm: 60_000 },
  { task: "timing_belt", label: "Correa de distribución", intervalKm: 100_000 },
];

function scheduleFor(vehicleLabel: string) {
  // Uso comercial/pickup típicamente exige cambios de aceite más seguidos.
  const isHeavyDuty = vehicleLabel.toLowerCase().includes("hilux");
  return BASE_SCHEDULE.map((item) =>
    item.task === "oil_change" && isHeavyDuty ? { ...item, intervalKm: 8_000 } : item,
  );
}

export const dueForDevice = query({
  args: { deviceId: v.id("devices") },
  handler: async (ctx, args) => {
    const device = await ctx.db.get("devices", args.deviceId);
    if (!device) return [];

    const [latest] = await ctx.db
      .query("telemetryReadings")
      .withIndex("by_device_and_timestamp", (q) => q.eq("deviceId", args.deviceId))
      .order("desc")
      .take(1);
    if (!latest) return [];

    const odometerKm = latest.odometerKm ?? 0;
    const items = scheduleFor(device.label ?? "").map((item) => {
      const kmSinceService = odometerKm % item.intervalKm;
      const kmRemaining = item.intervalKm - kmSinceService;
      const status: "overdue" | "due_soon" | "ok" =
        kmSinceService < 100 ? "overdue" : kmRemaining <= 500 ? "due_soon" : "ok";
      return { ...item, kmRemaining: Math.round(kmRemaining), status };
    });

    return items.sort((a, b) => a.kmRemaining - b.kmRemaining);
  },
});
