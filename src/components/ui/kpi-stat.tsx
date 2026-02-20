import * as React from "react";

import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

type KpiStatProps = {
  label: string;
  value: string;
  unavailable?: boolean;
  hint?: string;
  className?: string;
};

export function KpiStat({ label, value, unavailable = false, hint = "N/A", className }: KpiStatProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      {unavailable ? <Pill>{hint}</Pill> : null}
    </div>
  );
}

