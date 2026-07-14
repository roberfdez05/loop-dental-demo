import type { ReactNode } from "react";

import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { ClosingProbabilityRing } from "@/components/ui/ClosingProbabilityRing";
import {
  computePriority,
  computeClosingProbability,
  computeUrgencyLabel,
} from "@/lib/scoring/leadIntelligence";
import { isClosedStatus } from "@/lib/constants/status";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { Lead } from "@/lib/types/lead";

/**
 * Las 4 facetas de un lead: valor esperado, probabilidad de conversión,
 * urgencia y prioridad — reutilizado en fila compacta (LeadRow, Action
 * Center) y en formato completo (ficha de detalle del paciente).
 */
export function PriorityFacets({ lead, variant = "compact" }: { lead: Lead; variant?: "compact" | "full" }) {
  const priority = computePriority(lead);
  const probability = computeClosingProbability(lead);
  const urgency = computeUrgencyLabel(lead);
  const won = isClosedStatus(lead.status);

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <ClosingProbabilityRing probability={probability} won={won} size={30} />
        <PriorityBadge priority={priority} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Facet label="Valor esperado" value={formatCurrency(lead.estimatedValue)} />
      <Facet
        label="Probabilidad"
        value={won ? "Ganado" : `${probability}%`}
        node={!won ? <ClosingProbabilityRing probability={probability} size={28} /> : undefined}
      />
      <Facet label="Urgencia" value={urgency} />
      <Facet label="Prioridad" value={<PriorityBadge priority={priority} />} />
    </div>
  );
}

function Facet({
  label,
  value,
  node,
}: {
  label: string;
  value: string | ReactNode;
  node?: ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium text-zinc-400">{label}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {node}
        {typeof value === "string" ? (
          <p className="text-sm font-semibold text-zinc-900">{value}</p>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
