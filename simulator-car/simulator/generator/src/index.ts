import "dotenv/config";
import express from "express";
import cors from "cors";
import { convex, api } from "./convexClient.js";
import { createDevice, tick, type FaultType, type SimDevice } from "./generator.js";

const PORT = Number(process.env.PORT ?? 4000);
const TICK_MS = Number(process.env.TICK_MS ?? 1500);

const FAULT_TYPES: FaultType[] = [
  "none",
  "overheat",
  "battery_undercharge",
  "battery_overcharge",
  "check_engine",
];

const devices = new Map<string, SimDevice>();

function seedDevice(deviceId: string, vin: string, label: string, startOdometerKm = 0) {
  devices.set(deviceId, createDevice(deviceId, vin, label, startOdometerKm));
}

// Kilometrajes iniciales cercanos a un próximo servicio (ver web/convex/maintenance.ts),
// para que el panel de mantenimiento preventivo muestre algo real sin horas de simulación.
seedDevice("OBD-2026-X8912", "1HGCR2F83HA000000", "Toyota Corolla", 9_700);
seedDevice("OBD-2026-H1120", "8AJHZ3FS0M1234567", "Toyota Hilux", 7_750);

async function pushReading(device: SimDevice) {
  const payload = tick(device);
  try {
    await convex.mutation(api.telemetry.ingest, payload);
  } catch (err) {
    console.error(`[simulator] fallo al enviar ${device.deviceId}:`, err);
  }
}

setInterval(() => {
  for (const device of devices.values()) {
    if (device.running || device.faultProgress > 0) {
      void pushReading(device);
    }
  }
}, TICK_MS);

const app = express();
app.use(cors());
app.use(express.json());

function serializeDevice(d: SimDevice) {
  return {
    deviceId: d.deviceId,
    vin: d.vin,
    label: d.label,
    running: d.running,
    fault: d.fault,
    faultProgress: Number(d.faultProgress.toFixed(2)),
  };
}

app.get("/status", (_req, res) => {
  res.json({ tickMs: TICK_MS, devices: [...devices.values()].map(serializeDevice) });
});

app.post("/devices", (req, res) => {
  const { deviceId, vin, label } = req.body ?? {};
  if (typeof deviceId !== "string" || typeof vin !== "string") {
    return res.status(400).json({ error: "deviceId y vin son requeridos (string)" });
  }
  if (!devices.has(deviceId)) {
    seedDevice(deviceId, vin, typeof label === "string" ? label : deviceId);
  }
  res.json(serializeDevice(devices.get(deviceId)!));
});

app.post("/devices/:deviceId/start", (req, res) => {
  const device = devices.get(req.params.deviceId);
  if (!device) return res.status(404).json({ error: "device no encontrado" });
  device.running = true;
  res.json(serializeDevice(device));
});

app.post("/devices/:deviceId/stop", (req, res) => {
  const device = devices.get(req.params.deviceId);
  if (!device) return res.status(404).json({ error: "device no encontrado" });
  device.running = false;
  res.json(serializeDevice(device));
});

app.post("/devices/:deviceId/fault", (req, res) => {
  const device = devices.get(req.params.deviceId);
  if (!device) return res.status(404).json({ error: "device no encontrado" });
  const { type } = req.body ?? {};
  if (!FAULT_TYPES.includes(type)) {
    return res.status(400).json({ error: `type debe ser uno de: ${FAULT_TYPES.join(", ")}` });
  }
  device.fault = type;
  res.json(serializeDevice(device));
});

app.listen(PORT, () => {
  console.log(`[simulator] control API en http://localhost:${PORT}`);
  console.log(`[simulator] enviando telemetría cada ${TICK_MS}ms a Convex`);
});
