"use client";

import { CartesianGrid, Line, LineChart, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const maintenanceVariant: Record<
  string,
  "destructive" | "secondary" | "outline"
> = {
  overdue: "destructive",
  due_soon: "secondary",
  ok: "outline",
};

// Salud por subsistema — derivada de señales reales (no hay sensores separados
// de combustión/admisión en OBD-II genérico, así que solo puntuamos lo que sí medimos).
export function coolantHealth(tempC: number): number {
  if (tempC <= 90) return 100;
  if (tempC >= 115) return 0;
  if (tempC <= 105) return 100 - ((tempC - 90) / 15) * 50;
  return 50 - ((tempC - 105) / 10) * 50;
}

export function batteryHealth(v: number): number {
  if (v >= 13.2 && v <= 15.0) return 100;
  if (v < 13.2) return v <= 12.2 ? 0 : ((v - 12.2) / 1.0) * 100;
  return v >= 16.0 ? 0 : 100 - ((v - 15.0) / 1.0) * 100;
}

export function engineHealth(dtcCount: number, milStatus: boolean): number {
  if (!milStatus && dtcCount === 0) return 100;
  return Math.max(20, 100 - dtcCount * 30);
}

export function healthTone(score: number): "ok" | "warn" | "crit" {
  if (score >= 70) return "ok";
  if (score >= 35) return "warn";
  return "crit";
}

export const healthBarTone: Record<"ok" | "warn" | "crit", string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  crit: "bg-[#dc2626]",
};

export function formatEta(hours: number | null): string | null {
  if (hours === null) return null;
  if (hours < 1) return `~${Math.round(hours * 60)} min`;
  if (hours < 48) return `~${hours.toFixed(1)} h`;
  return `~${Math.round(hours / 24)} días`;
}

export function ArcGauge({
  value,
  min,
  max,
  size = 92,
  strokeWidth = 9,
  label,
  displayValue,
  critical,
}: {
  value: number;
  min: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  displayValue: string;
  critical?: boolean;
}) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = r + strokeWidth / 2;
  const height = r + strokeWidth;
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));

  const pointAt = (tt: number) => {
    const angle = Math.PI * (1 - tt);
    return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
  };
  const start = pointAt(0);
  const end = pointAt(1);
  const mid = pointAt(t);
  const bgPath = `M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`;
  const fgPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${t > 0.5 ? 1 : 0} 1 ${mid.x} ${mid.y}`;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg
        width={size}
        height={height}
        viewBox={`0 0 ${size} ${height}`}
        role="img"
        aria-label={`${label}: ${displayValue}`}
      >
        <path
          d={bgPath}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {t > 0 && (
          <path
            d={fgPath}
            fill="none"
            stroke={critical ? "var(--destructive)" : "var(--foreground)"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </svg>
      <span className="-mt-4 font-mono text-sm">{displayValue}</span>
      <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}

export function TrendChart({
  title,
  dataKey,
  color,
  data,
  eta,
  height = 72,
}: {
  title: string;
  dataKey: "coolantTempC" | "batteryVoltage";
  color: string;
  data: { t: number; coolantTempC: number; batteryVoltage: number }[];
  eta?: string | null;
  height?: number;
}) {
  const config: ChartConfig = { [dataKey]: { label: title, color } };
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{title}</span>
        {eta && (
          <span className="text-xs font-medium text-foreground">⚠ {eta}</span>
        )}
      </div>
      <ChartContainer
        config={config}
        className="aspect-auto w-full"
        style={{ height }}
      >
        <LineChart
          data={data}
          margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
          <ChartTooltip
            content={<ChartTooltipContent labelKey="t" hideLabel />}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={`var(--color-${dataKey})`}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
