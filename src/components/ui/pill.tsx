import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-secondary text-muted-foreground",
        subtle: "border border-border bg-card text-muted-foreground",
        success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
        warning: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {}

export function Pill({ className, variant, ...props }: PillProps) {
  return <span className={cn(pillVariants({ variant }), className)} {...props} />;
}

