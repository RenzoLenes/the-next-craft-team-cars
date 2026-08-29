import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  unit,
  hint,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  tone?: "neutral" | "ok" | "warn" | "crit";
  icon?: ReactNode;
}) {
  const toneRing = {
    neutral: "border-border",
    ok: "border-emerald-500/40",
    warn: "border-amber-500/50",
    crit: "border-[#dc2626]/50",
  }[tone];

  const toneText = {
    neutral: "text-foreground",
    ok: "text-emerald-600",
    warn: "text-amber-600",
    crit: "text-[#dc2626]",
  }[tone];

  return (
    <Card className={cn("border", toneRing)}>
      <CardContent className="flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            {label}
          </span>
          {icon ? <span className="text-muted-foreground">{icon}</span> : null}
        </div>
        <div className={cn("flex items-baseline gap-1", toneText)}>
          <span className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums">
            {value}
          </span>
          {unit ? (
            <span className="text-xs text-muted-foreground">{unit}</span>
          ) : null}
        </div>
        {hint ? (
          <span className="text-[11px] text-muted-foreground">{hint}</span>
        ) : null}
      </CardContent>
    </Card>
  );
}
