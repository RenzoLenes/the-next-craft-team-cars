// Datos de demo. La forma es IDÉNTICA al schema Convex de `simulator-car/web/convex/schema.ts`,
// así que cambiar a datos reales es reemplazar cada `getX()` por su `useQuery(api.…)`.

export type Severity = "warning" | "critical";
export type AlertType =
  | "overheat"
  | "battery_undercharge"
  | "battery_overcharge"
  | "check_engine";

export type Device = {
  _id: string;
  deviceId: string;
  vin: string;
  label?: string;
  status: "active" | "inactive";
};

export type TelemetryReading = {
  deviceId: string;
  timestamp: number;
  engineRpm: number;
  vehicleSpeedKmh: number;
  coolantTempC: number;
  engineLoadPct: number;
  throttlePositionPct: number;
  fuelLevelPct: number;
  batteryVoltage: number;
  odometerKm: number;
  milStatus: boolean;
  dtcCount: number;
  troubleCodes: string[];
};

export type Alert = {
  _id: string;
  deviceId: string;
  timestamp: number;
  severity: Severity;
  type: AlertType;
  message: string;
  value: number;
  threshold: number;
  resolved: boolean;
};

export const devices: Device[] = [
  {
    _id: "d1",
    deviceId: "OBD-2026-X8912",
    vin: "8AJHA8CD9N1620114",
    label: "Toyota Hilux · Flota 03",
    status: "active",
  },
  {
    _id: "d2",
    deviceId: "OBD-2026-X8913",
    vin: "JTDBR32E720012345",
    label: "Toyota Corolla · Flota 01",
    status: "active",
  },
  {
    _id: "d3",
    deviceId: "OBD-2026-X8914",
    vin: "MR0FZ29G901234567",
    label: "Toyota Yaris · Flota 02",
    status: "active",
  },
  {
    _id: "d4",
    deviceId: "OBD-2026-X8915",
    vin: "KMHD35LE8FU123456",
    label: "Hyundai Accent · Flota 01",
    status: "inactive",
  },
];

export const latest: Record<string, TelemetryReading> = {
  d1: {
    deviceId: "d1",
    timestamp: Date.now(),
    engineRpm: 2480,
    vehicleSpeedKmh: 68,
    coolantTempC: 117,
    engineLoadPct: 71,
    throttlePositionPct: 44,
    fuelLevelPct: 38,
    batteryVoltage: 14.1,
    odometerKm: 84213,
    milStatus: true,
    dtcCount: 1,
    troubleCodes: ["P0217"],
  },
  d2: {
    deviceId: "d2",
    timestamp: Date.now(),
    engineRpm: 1820,
    vehicleSpeedKmh: 52,
    coolantTempC: 91,
    engineLoadPct: 38,
    throttlePositionPct: 22,
    fuelLevelPct: 64,
    batteryVoltage: 12.1,
    odometerKm: 59820,
    milStatus: false,
    dtcCount: 0,
    troubleCodes: [],
  },
  d3: {
    deviceId: "d3",
    timestamp: Date.now(),
    engineRpm: 780,
    vehicleSpeedKmh: 0,
    coolantTempC: 88,
    engineLoadPct: 12,
    throttlePositionPct: 0,
    fuelLevelPct: 91,
    batteryVoltage: 14.3,
    odometerKm: 31044,
    milStatus: false,
    dtcCount: 0,
    troubleCodes: [],
  },
  d4: {
    deviceId: "d4",
    timestamp: Date.now(),
    engineRpm: 0,
    vehicleSpeedKmh: 0,
    coolantTempC: 24,
    engineLoadPct: 0,
    throttlePositionPct: 0,
    fuelLevelPct: 12,
    batteryVoltage: 11.8,
    odometerKm: 128907,
    milStatus: false,
    dtcCount: 0,
    troubleCodes: [],
  },
};

export const alerts: Alert[] = [
  {
    _id: "a1",
    deviceId: "d1",
    timestamp: Date.now() - 42_000,
    severity: "critical",
    type: "overheat",
    message: "Temperatura de refrigerante crítica: 117°C",
    value: 117,
    threshold: 115,
    resolved: false,
  },
  {
    _id: "a2",
    deviceId: "d1",
    timestamp: Date.now() - 38_000,
    severity: "warning",
    type: "check_engine",
    message: "Check engine activo (1 DTC): P0217",
    value: 1,
    threshold: 0,
    resolved: false,
  },
  {
    _id: "a3",
    deviceId: "d2",
    timestamp: Date.now() - 5 * 60_000,
    severity: "critical",
    type: "battery_undercharge",
    message: "Voltaje de batería crítico: 12.1V",
    value: 12.1,
    threshold: 12.2,
    resolved: false,
  },
  {
    _id: "a4",
    deviceId: "d4",
    timestamp: Date.now() - 3 * 3600_000,
    severity: "warning",
    type: "battery_undercharge",
    message: "Voltaje de batería bajo: 11.8V",
    value: 11.8,
    threshold: 13.2,
    resolved: false,
  },
];

export const alertTypeLabel: Record<AlertType, string> = {
  overheat: "Sobrecalentamiento",
  battery_undercharge: "Batería baja",
  battery_overcharge: "Sobrecarga",
  check_engine: "Check engine",
};

export const trend = Array.from({ length: 24 }, (_, i) => ({
  t: `${String(i).padStart(2, "0")}:00`,
  coolant: 88 + Math.round(Math.sin(i / 3) * 4) + (i > 18 ? (i - 18) * 4 : 0),
  battery: 14.2 - (i > 14 ? (i - 14) * 0.12 : 0),
}));
