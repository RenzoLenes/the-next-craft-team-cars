import { v } from "convex/values";
import { mutation, query, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const COOLANT_WARN_C = 105;
const COOLANT_CRIT_C = 115;
const BATTERY_CRIT_LOW_V = 12.2;
const BATTERY_WARN_LOW_V = 13.2;
const BATTERY_WARN_HIGH_V = 15.0;

type AlertType =
  | "overheat"
  | "battery_undercharge"
  | "battery_overcharge"
  | "check_engine";

async function upsertAlert(
  ctx: MutationCtx,
  deviceId: Id<"devices">,
  timestamp: number,
  type: AlertType,
  severity: "warning" | "critical",
  message: string,
  value: number,
  threshold: number,
) {
  const active = await ctx.db
    .query("alerts")
    .withIndex("by_device_and_resolved", (q) =>
      q.eq("deviceId", deviceId).eq("resolved", false),
    )
    .take(10);
  const existing = active.find((a) => a.type === type);
  if (existing) {
    await ctx.db.patch("alerts", existing._id, { severity, message, value, threshold, timestamp });
  } else {
    await ctx.db.insert("alerts", {
      deviceId,
      timestamp,
      severity,
      type,
      message,
      value,
      threshold,
      resolved: false,
    });
  }
}

async function resolveAlertType(ctx: MutationCtx, deviceId: Id<"devices">, type: AlertType) {
  const active = await ctx.db
    .query("alerts")
    .withIndex("by_device_and_resolved", (q) =>
      q.eq("deviceId", deviceId).eq("resolved", false),
    )
    .take(10);
  const existing = active.find((a) => a.type === type);
  if (existing) {
    await ctx.db.patch("alerts", existing._id, { resolved: true });
  }
}

async function evaluateOverheat(
  ctx: MutationCtx,
  deviceId: Id<"devices">,
  timestamp: number,
  coolantTempC: number,
) {
  if (coolantTempC >= COOLANT_CRIT_C) {
    await upsertAlert(
      ctx,
      deviceId,
      timestamp,
      "overheat",
      "critical",
      `Temperatura de refrigerante crítica: ${coolantTempC}°C`,
      coolantTempC,
      COOLANT_CRIT_C,
    );
  } else if (coolantTempC >= COOLANT_WARN_C) {
    await upsertAlert(
      ctx,
      deviceId,
      timestamp,
      "overheat",
      "warning",
      `Temperatura de refrigerante elevada: ${coolantTempC}°C`,
      coolantTempC,
      COOLANT_WARN_C,
    );
  } else {
    await resolveAlertType(ctx, deviceId, "overheat");
  }
}

async function evaluateBattery(
  ctx: MutationCtx,
  deviceId: Id<"devices">,
  timestamp: number,
  batteryVoltage: number,
) {
  if (batteryVoltage <= BATTERY_CRIT_LOW_V) {
    await upsertAlert(
      ctx,
      deviceId,
      timestamp,
      "battery_undercharge",
      "critical",
      `Voltaje de batería crítico: ${batteryVoltage}V`,
      batteryVoltage,
      BATTERY_CRIT_LOW_V,
    );
    await resolveAlertType(ctx, deviceId, "battery_overcharge");
  } else if (batteryVoltage <= BATTERY_WARN_LOW_V) {
    await upsertAlert(
      ctx,
      deviceId,
      timestamp,
      "battery_undercharge",
      "warning",
      `Voltaje de batería bajo: ${batteryVoltage}V`,
      batteryVoltage,
      BATTERY_WARN_LOW_V,
    );
    await resolveAlertType(ctx, deviceId, "battery_overcharge");
  } else if (batteryVoltage >= BATTERY_WARN_HIGH_V) {
    await upsertAlert(
      ctx,
      deviceId,
      timestamp,
      "battery_overcharge",
      "warning",
      `Voltaje de batería alto: ${batteryVoltage}V`,
      batteryVoltage,
      BATTERY_WARN_HIGH_V,
    );
    await resolveAlertType(ctx, deviceId, "battery_undercharge");
  } else {
    await resolveAlertType(ctx, deviceId, "battery_undercharge");
    await resolveAlertType(ctx, deviceId, "battery_overcharge");
  }
}

async function evaluateCheckEngine(
  ctx: MutationCtx,
  deviceId: Id<"devices">,
  timestamp: number,
  milStatus: boolean,
  dtcCount: number,
  troubleCodes: string[],
) {
  if (milStatus || dtcCount > 0) {
    const codes = troubleCodes.length > 0 ? troubleCodes.join(", ") : "sin código específico";
    await upsertAlert(
      ctx,
      deviceId,
      timestamp,
      "check_engine",
      "warning",
      `Check engine activo (${dtcCount} DTC): ${codes}`,
      dtcCount,
      0,
    );
  } else {
    await resolveAlertType(ctx, deviceId, "check_engine");
  }
}

export const ingest = mutation({
  args: {
    deviceId: v.string(),
    vin: v.string(),
    label: v.optional(v.string()),
    timestamp: v.number(),
    latitude: v.number(),
    longitude: v.number(),
    altitudeM: v.number(),
    speedGpsKmh: v.number(),
    engineRpm: v.number(),
    vehicleSpeedKmh: v.number(),
    coolantTempC: v.number(),
    engineLoadPct: v.number(),
    throttlePositionPct: v.number(),
    fuelLevelPct: v.number(),
    batteryVoltage: v.number(),
    odometerKm: v.number(),
    milStatus: v.boolean(),
    dtcCount: v.number(),
    troubleCodes: v.array(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existingDevice = await ctx.db
      .query("devices")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .unique();

    let deviceDocId: Id<"devices">;
    if (existingDevice === null) {
      deviceDocId = await ctx.db.insert("devices", {
        deviceId: args.deviceId,
        vin: args.vin,
        label: args.label,
        status: "active",
      });
    } else {
      deviceDocId = existingDevice._id;
      const patch: Record<string, unknown> = {};
      if (existingDevice.status !== "active") patch.status = "active";
      if (args.label && existingDevice.label !== args.label) patch.label = args.label;
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch("devices", deviceDocId, patch);
      }
    }

    await ctx.db.insert("telemetryReadings", {
      deviceId: deviceDocId,
      timestamp: args.timestamp,
      latitude: args.latitude,
      longitude: args.longitude,
      altitudeM: args.altitudeM,
      speedGpsKmh: args.speedGpsKmh,
      engineRpm: args.engineRpm,
      vehicleSpeedKmh: args.vehicleSpeedKmh,
      coolantTempC: args.coolantTempC,
      engineLoadPct: args.engineLoadPct,
      throttlePositionPct: args.throttlePositionPct,
      fuelLevelPct: args.fuelLevelPct,
      batteryVoltage: args.batteryVoltage,
      odometerKm: args.odometerKm,
      milStatus: args.milStatus,
      dtcCount: args.dtcCount,
      troubleCodes: args.troubleCodes,
    });

    await evaluateOverheat(ctx, deviceDocId, args.timestamp, args.coolantTempC);
    await evaluateBattery(ctx, deviceDocId, args.timestamp, args.batteryVoltage);
    await evaluateCheckEngine(
      ctx,
      deviceDocId,
      args.timestamp,
      args.milStatus,
      args.dtcCount,
      args.troubleCodes,
    );

    return null;
  },
});

export const latestByDevice = query({
  args: { deviceId: v.id("devices") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("telemetryReadings")
      .withIndex("by_device_and_timestamp", (q) => q.eq("deviceId", args.deviceId))
      .order("desc")
      .take(1);
    return rows[0] ?? null;
  },
});

export const historyByDevice = query({
  args: { deviceId: v.id("devices"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("telemetryReadings")
      .withIndex("by_device_and_timestamp", (q) => q.eq("deviceId", args.deviceId))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const fleetOverview = query({
  args: {},
  handler: async (ctx) => {
    const devices = await ctx.db.query("devices").order("desc").take(50);
    const overview = [];
    for (const device of devices) {
      const rows = await ctx.db
        .query("telemetryReadings")
        .withIndex("by_device_and_timestamp", (q) => q.eq("deviceId", device._id))
        .order("desc")
        .take(1);
      overview.push({ device, latest: rows[0] ?? null });
    }
    return overview;
  },
});
