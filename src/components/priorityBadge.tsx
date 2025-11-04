"use client";

import { Badge } from "@/components/ui/badge";
import type { Prioritas } from "@/lib/types";
import { cn } from "@/lib/utils";

const priorityStyle: Record<Prioritas, { className: string; label: string }> = {
  RENDAH: {
    className: "bg-muted/60 text-foreground/70 border-border/60",
    label: "RENDAH",
  },
  SEDANG: {
    className: "bg-primary/12 text-primary border-primary/20",
    label: "SEDANG",
  },
  TINGGI: {
    // Amber accent sesuai guideline
    className: "bg-accent/20 text-accent border-accent/30",
    label: "TINGGI",
  },
};

export function PriorityBadge({
  level,
  className,
}: {
  level: Prioritas;
  className?: string;
}) {
  const p = priorityStyle[level];
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs",
        p.className,
        className
      )}
    >
      {p.label}
    </Badge>
  );
}
