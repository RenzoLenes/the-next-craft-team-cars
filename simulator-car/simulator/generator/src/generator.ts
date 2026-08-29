export type FaultType =
  | "none"
  | "overheat"
  | "battery_undercharge"
  | "battery_overcharge"
  | "check_engine";

export type DriveMode = "city" | "highway";

export interface SimDevice {
  deviceId: string;
  vin: string;
  label: string;
  running: boolean;
  mode: DriveMode;
  cruiseTargetKmh: number; // deriva lento dentro del rango del modo — el "objetivo" del conductor
  currentSpeedKmh: number; // se acerca al target con un límite de aceleración, no salta
  fault: FaultType;
  faultProgress: number; // 0..1 — avanza mientras el fallo está activo, retrocede al limpiarlo
  fuelLevelPct: number; // decrece lentamente y persiste entre ticks
  odometerKm: number; // acumulado, persiste entre ticks
  lat: number;
  lon: number;
  headingDeg: number;
}

const FAULT_STEP = 1 / 30; // ~30 ticks para llegar a severidad máxima (30 * 1.5s ≈ 45s)
const RECOVERY_STEP = 1 / 15; // recupera más rápido que degrada, para demo

const MODE_BOUNDS: Record<DriveMode, { min: number; max: number; maxAccel: number }> = {
  city: { min: 15, max: 55, maxAccel: 4 },
  highway: { min: 70, max: 130, maxAccel: 7 },
};

const TROUBLE_CODES: Record<string, string[]> = {
  overheat: ["P0128", "P0217"],
  battery_undercharge: ["P0562", "P0620"],
  battery_overcharge: ["P0563"],
  check_engine: ["P0301", "P0171", "P0420"],
};

export function createDevice(
  deviceId: string,
  vin: string,
  label: string,
  startOdometerKm = 0,
): SimDevice {
  return {
    deviceId,
    vin,
    label,
    running: false,
    mode: "city",
    cruiseTargetKmh: 0,
    currentSpeedKmh: 0,
    fault: "none",
    faultProgress: 0,
    fuelLevelPct: 78,
    odometerKm: startOdometerKm,
    // Lima, Perú, como en el payload de referencia
    lat: -12.04637,
    lon: -77.04279,
    headingDeg: Math.random() * 360,
  };
}

function noise(range: number) {
  return (Math.random() - 0.5) * 2 * range;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export interface TelemetryPayload {
  deviceId: string;
  vin: string;
  label: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  altitudeM: number;
  speedGpsKmh: number;
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
}

export function tick(device: SimDevice): TelemetryPayload {
  // progresión del fallo activo, recuperación del resto
  if (device.fault !== "none") {
    device.faultProgress = clamp(device.faultProgress + FAULT_STEP, 0, 1);
  } else if (device.faultProgress > 0) {
    device.faultProgress = clamp(device.faultProgress - RECOVERY_STEP, 0, 1);
  }

  // velocidad con inercia: el objetivo de crucero deriva lento dentro del modo,
  // y la velocidad actual lo persigue con un límite de aceleración — un trazo
  // continuo (como manejar de verdad), no un valor independiente por tick.
  if (device.running) {
    const bounds = MODE_BOUNDS[device.mode];
    device.cruiseTargetKmh = clamp(device.cruiseTargetKmh + noise(4), bounds.min, bounds.max);
    const delta = clamp(device.cruiseTargetKmh - device.currentSpeedKmh, -bounds.maxAccel, bounds.maxAccel);
    device.currentSpeedKmh = clamp(device.currentSpeedKmh + delta + noise(1), 0, bounds.max + 10);
  } else {
    device.cruiseTargetKmh = 0;
    device.currentSpeedKmh = clamp(device.currentSpeedKmh - 8, 0, 200);
  }
  const speedKmh = device.currentSpeedKmh;

  // movimiento simulado (random walk pequeño alrededor del punto base)
  device.headingDeg = (device.headingDeg + noise(15) + 360) % 360;
  const metersPerTick = (speedKmh / 3.6) * 1.5; // tick ≈ 1.5s
  const degPerMeter = 1 / 111_320;
  device.lat += Math.cos((device.headingDeg * Math.PI) / 180) * metersPerTick * degPerMeter;
  device.lon += Math.sin((device.headingDeg * Math.PI) / 180) * metersPerTick * degPerMeter;
  device.odometerKm += metersPerTick / 1000;

  const engineRpm = device.running
    ? clamp(900 + speedKmh * 12 + noise(150), 700, 4500)
    : clamp(800 + noise(50), 0, 900);
  const engineLoadPct = clamp((speedKmh / 120) * 100 + noise(8), 0, 100);
  const throttlePositionPct = clamp(engineLoadPct * 0.8 + noise(5), 0, 100);

  // combustible baja lentamente mientras corre, nunca por debajo de 10%
  if (device.running) {
    device.fuelLevelPct = clamp(device.fuelLevelPct - 0.01, 10, 100);
  }

  // temperatura de refrigerante: opera ~90°C, sube si hay fallo de sobrecalentamiento
  let coolantTempC = clamp(90 + noise(2), 82, 95);
  if (device.fault === "overheat") {
    coolantTempC = 90 + device.faultProgress * 35 + noise(2);
  } else if (device.faultProgress > 0) {
    // se está enfriando tras limpiar el fallo
    coolantTempC = 90 + device.faultProgress * 35 + noise(2);
  }

  // voltaje de batería: ~13.8-14.4V con motor encendido
  let batteryVoltage = clamp(14.1 + noise(0.3), 13.6, 14.6);
  if (device.fault === "battery_undercharge") {
    batteryVoltage = 14.0 - device.faultProgress * 3.2 + noise(0.15);
  } else if (device.fault === "battery_overcharge") {
    batteryVoltage = 14.0 + device.faultProgress * 2.5 + noise(0.15);
  }

  // check engine: aparece de inmediato, códigos escalan con el progreso
  const milStatus = device.fault === "check_engine" && device.faultProgress > 0;
  const codes = milStatus
    ? TROUBLE_CODES.check_engine.slice(0, 1 + Math.floor(device.faultProgress * 2))
    : [];

  return {
    deviceId: device.deviceId,
    vin: device.vin,
    label: device.label,
    timestamp: Date.now(),
    latitude: Number(device.lat.toFixed(5)),
    longitude: Number(device.lon.toFixed(5)),
    altitudeM: 154.2,
    speedGpsKmh: Number(speedKmh.toFixed(1)),
    engineRpm: Math.round(engineRpm),
    vehicleSpeedKmh: Math.round(speedKmh),
    coolantTempC: Number(coolantTempC.toFixed(1)),
    engineLoadPct: Number(engineLoadPct.toFixed(1)),
    throttlePositionPct: Number(throttlePositionPct.toFixed(1)),
    fuelLevelPct: Number(device.fuelLevelPct.toFixed(1)),
    batteryVoltage: Number(batteryVoltage.toFixed(2)),
    odometerKm: Number(device.odometerKm.toFixed(2)),
    milStatus,
    dtcCount: codes.length,
    troubleCodes: codes,
  };
}
