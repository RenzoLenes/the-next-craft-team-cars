export type SignalLevel = "ok" | "alerta" | "limite";

export type CarMetrics = {
  speed: number;
  rpm: number;
  temperature: number;
  battery: number;
  signal: SignalLevel;
};

export const INITIAL_METRICS: CarMetrics = {
  speed: 72,
  rpm: 2100,
  temperature: 86,
  battery: 78,
  signal: "ok",
};

export function deriveSignal(speed: number, temperature: number): SignalLevel {
  if (speed >= 125 || temperature >= 105) return "limite";
  if (speed >= 110 || temperature >= 98) return "alerta";
  return "ok";
}

export function signalLabel(signal: SignalLevel): string {
  if (signal === "alerta") return "ALERTA";
  if (signal === "limite") return "LÍMITE";
  return "OK";
}
