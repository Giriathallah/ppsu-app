"use client";

import { Badge } from "@/components/ui/badge";
import type { TugasStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyle: Record<TugasStatus, { className: string; label: string }> = {
  OPEN: {
    className: "border-border/60 text-foreground/70",
    label: "OPEN",
  },
  ASSIGNED: {
    className: "bg-secondary text-secondary-foreground border-secondary/50",
    label: "ASSIGNED",
  },
  IN_PROGRESS: {
    className: "bg-primary/15 text-primary border-primary/20",
    label: "IN PROGRESS",
  },
  DONE: {
    className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
    label: "DONE",
  },
  REJECTED: {
    className: "bg-destructive/15 text-destructive border-destructive/20",
    label: "REJECTED",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: TugasStatus;
  className?: string;
}) {
  const s = statusStyle[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs",
        s.className,
        className
      )}
    >
      {s.label}
    </Badge>
  );
}
