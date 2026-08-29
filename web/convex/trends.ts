import { v } from "convex/values";
import { query } from "./_generated/server";

// Umbrales — deben calzar con telemetry.ts
const COOLANT_CRIT_C = 115;
const BATTERY_CRIT_LOW_V = 12.2;
const MIN_POINTS = 5;
const EPSILON = 1e-4;

interface Point {
  t: number; // horas desde el primer punto de la muestra
  v: number;
}

export interface Forecast {
  currentValue: number;
  slopePerHour: number;
  etaHours: number | null; // null = no está en camino a cruzar el umbral con esta tendencia
  threshold: number;
}

function linearForecast(
  points: Point[],
  threshold: number,
  direction: "rising" | "falling",
): Forecast | null {
  if (points.length < MIN_POINTS) return null;

  const n = points.length;
  let sumT = 0;
  let sumV = 0;
  let sumTT = 0;
  let sumTV = 0;
  for (const p of points) {
    sumT += p.t;
    sumV += p.v;
    sumTT += p.t * p.t;
    sumTV += p.t * p.v;
  }
  const denom = n * sumTT - sumT * sumT;
  const slope = denom === 0 ? 0 : (n * sumTV - sumT * sumV) / denom;
  const currentValue = points[points.length - 1].v;

  let etaHours: number | null = null;
  if (direction === "rising" && slope > EPSILON && currentValue < threshold) {
    etaHours = (threshold - currentValue) / slope;
  } else if (
    direction === "falling" &&
    slope < -EPSILON &&
    currentValue > threshold
  ) {
    etaHours = (currentValue - threshold) / -slope;
  }

  return { currentValue, slopePerHour: slope, etaHours, threshold };
}

export const forecastForDevice = query({
  args: { deviceId: v.id("devices") },
  handler: async (ctx, args) => {
    const recent = await ctx.db
      .query("telemetryReadings")
      .withIndex("by_device_and_timestamp", (q) =>
        q.eq("deviceId", args.deviceId),
      )
      .order("desc")
      .take(20);

    if (recent.length < MIN_POINTS) {
      return { coolant: null, battery: null };
    }

    const ascending = recent.slice().reverse();
    const t0 = ascending[0].timestamp;
    const coolantPoints = ascending.map((r) => ({
      t: (r.timestamp - t0) / 3_600_000,
      v: r.coolantTempC,
    }));
    const batteryPoints = ascending.map((r) => ({
      t: (r.timestamp - t0) / 3_600_000,
      v: r.batteryVoltage,
    }));

    return {
      coolant: linearForecast(coolantPoints, COOLANT_CRIT_C, "rising"),
      battery: linearForecast(batteryPoints, BATTERY_CRIT_LOW_V, "falling"),
    };
  },
});
