import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  devices: defineTable({
    deviceId: v.string(), // e.g. "OBD-2026-X8912"
    vin: v.string(),
    label: v.optional(v.string()), // e.g. "Toyota Hilux - Flota 03"
    status: v.union(v.literal("active"), v.literal("inactive")),
  }).index("by_deviceId", ["deviceId"]),

  telemetryReadings: defineTable({
    deviceId: v.id("devices"),
    timestamp: v.number(), // ms epoch, from the simulator payload

    // location
    latitude: v.number(),
    longitude: v.number(),
    altitudeM: v.number(),
    speedGpsKmh: v.number(),

    // telemetry
    engineRpm: v.number(),
    vehicleSpeedKmh: v.number(),
    coolantTempC: v.number(),
    engineLoadPct: v.number(),
    throttlePositionPct: v.number(),
    fuelLevelPct: v.number(),
    batteryVoltage: v.number(),
    odometerKm: v.optional(v.number()), // opcional: lecturas previas a este campo no lo tienen

    // diagnostics
    milStatus: v.boolean(),
    dtcCount: v.number(),
    troubleCodes: v.array(v.string()),
  }).index("by_device_and_timestamp", ["deviceId", "timestamp"]),

  alerts: defineTable({
    deviceId: v.id("devices"),
    timestamp: v.number(),
    severity: v.union(v.literal("warning"), v.literal("critical")),
    type: v.union(
      v.literal("overheat"),
      v.literal("battery_undercharge"),
      v.literal("battery_overcharge"),
      v.literal("check_engine"),
    ),
    message: v.string(),
    value: v.number(),
    threshold: v.number(),
    resolved: v.boolean(),
  })
    .index("by_device_and_timestamp", ["deviceId", "timestamp"])
    .index("by_device_and_resolved", ["deviceId", "resolved"])
    .index("by_resolved", ["resolved"]),
});
