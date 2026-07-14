import { Badge } from "@/components/ui/Badge";
import { STATUS_LABEL } from "@/lib/constants/status";
import type { LeadStatus } from "@/lib/types/lead";

type Variant = "neutral" | "accentLight" | "accent" | "dark";

/** Agrupadas por fase del embudo (temprana/media/avanzada/cerrada), no un color por estado. */
const STATUS_STYLES: Record<LeadStatus, { variant: Variant; dot: string }> = {
  nuevo: { variant: "neutral", dot: "bg-zinc-400" },
  contactado: { variant: "neutral", dot: "bg-zinc-500" },
  interesado: { variant: "accentLight", dot: "bg-accent-400" },
  cita_reservada: { variant: "accentLight", dot: "bg-accent-500" },
  diagnostico: { variant: "accentLight", dot: "bg-accent-500" },
  presupuesto: { variant: "accent", dot: "bg-accent-600" },
  seguimiento: { variant: "accent", dot: "bg-accent-600" },
  aceptado: { variant: "dark", dot: "bg-white" },
  paciente: { variant: "dark", dot: "bg-white" },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <Badge variant={style.variant} dotClassName={style.dot}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
