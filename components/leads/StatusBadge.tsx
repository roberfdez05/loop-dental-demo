import { Badge } from "@/components/ui/Badge";
import { STATUS_LABEL } from "@/lib/constants/status";
import type { LeadStatus } from "@/lib/types/lead";

const STATUS_STYLES: Record<LeadStatus, { variant: "neutral" | "accentLight" | "accent" | "dark"; dot: string }> = {
  nuevo: { variant: "neutral", dot: "bg-zinc-400" },
  contactado: { variant: "accentLight", dot: "bg-accent-400" },
  interesado: { variant: "accent", dot: "bg-accent-600" },
  cita_agendada: { variant: "dark", dot: "bg-white" },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <Badge variant={style.variant} dotClassName={style.dot}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
