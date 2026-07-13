import { Badge } from "@/components/ui/Badge";
import type { Priority } from "@/lib/scoring/leadIntelligence";

const PRIORITY_CONFIG: Record<Priority, { label: string; variant: "dark" | "accent" | "neutral" }> = {
  alta: { label: "Alta", variant: "dark" },
  media: { label: "Media", variant: "accent" },
  baja: { label: "Baja", variant: "neutral" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, variant } = PRIORITY_CONFIG[priority];
  return <Badge variant={variant}>{label}</Badge>;
}
